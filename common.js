'use strict';

{
	const events = require('./events');

	const assert = (cond, msg) => {
		if (!cond) throw new Error(msg);
	};

	class MfMenu extends events {
		constructor ({document, menu}, {userState}) {
			super();

			this._dom = {document, menu};
			this._dependencies = {userState};

			this._menuPath = '/wiki/MediaWiki:Sidebar?action=raw';
			this._anchorBaseUrl = 'https://psychonautwiki.org'

			this._menu = {};
			this._menuUserLinks = [];

			/* failover */
			this._retryCount = 0;
			this._retryMax = 3;

			this._populateUserLinks();
		}

		_populateUserLinks () {
			const userState = this._dependencies.userState;
			const {ANON, USER/*, ADMIN, SYSOP*/} = userState._flags;

			const username = userState.getUserName();

			/*
				Anonymous user sees this:
					[Watchlist]
					[Settings]
					[Login]
					[Register]

				Authenticated user sees this:
					[Watchlist]
					[Upload]
					[Settings]
					[<username>] [Logout]
			*/

			const encodedPageName = ('encodeURIComponent' in window) ? encodeURIComponent(this._dependencies.userState.getPageName()) : '';

			this._menuUserLinks = [
				[ANON ^ USER, [['Watchlist', 'Special:Watchlist', ['mw-ui-icon-watchlist']]]],
				[USER, [['Upload', 'Special:Uploads', ['mw-ui-icon-uploads', 'menu-item-upload']]]],
				[ANON ^ USER, [['Settings', 'Special:MobileOptions', ['mw-ui-icon-mobileoptions']]]],
				[USER, [
					[`${username}`, `Special:UserProfile/${username}`, ['mw-ui-icon', 'mw-ui-icon-before', 'mw-ui-icon-profile', 'truncated-text', 'primary-action']],
					['Logout', 'Special:UserLogout', ['mw-ui-icon', 'mw-ui-icon-element', 'mw-ui-icon-secondary-logout', 'secondary-action', 'truncated-text']]
				]],
				[ANON, [['Login', `/w/index.php?title=Special:UserLogin&returnto=${encodedPageName}`, ['mw-ui-icon', 'mw-ui-icon-before', 'mw-ui-icon-profile']]]],
				[ANON, [['Register', `/w/index.php?title=Special:UserLogin&type=signup&returnto=${encodedPageName}`, ['mw-ui-icon', 'mw-ui-icon-before', 'mw-ui-icon-anonymous-white']]]]
			];
		}

		_genericXhr (method, path, data, isJson, cb) {
			const xhr = new XMLHttpRequest();

			xhr.open(method, path, true);

			if (isJson) {
				xhr.setRequestHeader('Content-type', 'application/json');
			}

			xhr.onreadystatechange = function() {
				if (xhr.readyState !== 4) return;

				if (!isJson) {
					return cb(xhr.status >= 400, this.responseText);
				}

				let response;

				try {
					response = JSON.parse(this.responseText);
				} catch(err) {
					return cb(err);
				}

				cb(xhr.status >= 400, response);
			}

			xhr.send(data);
		}

		_setupBus () {
			this.on('sidebar', ({err, data}) => {
				try {
					this._processMenu({err, data});
				} catch(parseError) {
					/* gracefully handle parser errors */
					this._ingestError(parseError);
				}
			});
		}

		_ingestError (err) {
			if ('Raven' in window && 'captureException' in Raven) {
				/* send to sentry */
				Raven.captureException(err);
			}
		}

		_handleError (err) {
			this._ingestError(err);

			if (this._retryCount >= this._retryMax) {
				const retryOverflow = new Error('Could not load sidebar.');

				return this._ingestError(retryOverflow);
			}

			/* make sure we get off the stack */
			setTimeout(() => this._retrieveSidebar(), 0);
		}

		_parseMenu (data) {
			const menuLines = data
				/* extract lines */
				.split('\n')
				/* remove empty lines */
				.filter(x => x)
				/* process lines */
				.map(line => [
					/* get level by stars */
					line.match(/\*+/)[0].length,

					/* get line payload */
					line.match(/\*+(.*?)$/)[1]
				]);

			return menuLines.reduce((acc, curr) => {
				if (curr[0] === 1) {
					++acc.i;

					acc.sections.push([curr[1], []]);
				} else {
					acc.sections[acc.i][1].push(curr[1]);
				}

				return acc;
			}, {i: -1, sections: []});
		}

		_$createElement (...args) {
			return this._dom.document.createElement(...args);
		}

		_$wrapElement (tle, element) {
			const wrapper = this._$createElement(tle);

			wrapper.appendChild(element);

			return wrapper;
		}

		_$retrieveLink (anchorLink) {
			/* if we have a FQ URL, return */
			if(/^(https?|ftp):\/\/[^s\/$.?#].[^s]*$/i.test(anchorLink)){
				return anchorLink;
			}

			/* if we have a link with heading slash, use as basepath */
			if (/\/(.*)$/.test(anchorLink)) {
				return `${this._anchorBaseUrl}${anchorLink}`
			}

			/* else, treat as article */
			return `${this._anchorBaseUrl}/wiki/${anchorLink}`;
		}

		_$isCurrentPage (anchorLink) {
			const massagedAnchor = anchorLink.replace(/\s/g, '_')

			return RegExp(massagedAnchor, 'i').test(location.href);
		}

		_$menuLinkItem (linkItems) {
			const wrapper = this._$createElement('li');

			linkItems.forEach(linkItem => {
				const [title, anchorLink, anchorClasses] = linkItem;

				const anchor = this._$createElement('a');

				anchor.href = this._$retrieveLink(anchorLink);
				anchor.innerText = title;

				anchor.classList.add('mw-ui-icon', 'mw-ui-icon-before');
				anchor.classList.add(...anchorClasses);

				wrapper.appendChild(anchor);

				if (this._$isCurrentPage(anchorLink)) {
					wrapper.classList.add('mw-ui-menu-current-page');
				}
			});

			return wrapper;
		}

		_renderSection (section) {
			const navLabel = this._$createElement('h3');

			navLabel.innerText = section[0];

			const subsections = [
				this._$wrapElement('li', navLabel),

				...section[1].map(item => {
					const [anchorLink, title] = item.split('|');

					const iconClassSuffix = title.replace(/\s+/ig, '-');
					const anchorClass = `icon-${iconClassSuffix}`;

					return this._$menuLinkItem([[title, anchorLink, [anchorClass]]]);
				})
			];

			const container = this._$createElement('ul');

			subsections.forEach(subsection =>
				container.appendChild(subsection)
			);

			return container;
		}

		_renderUserSection () {
			const currentUserFlags = this._dependencies.userState.getUserFlags();

			const container = this._$createElement('ul');

			container.classList.add('mw-ui-menu-user-section')

			const navLabel = this._$createElement('h3');

			navLabel.innerText = 'User actions';

			container.appendChild(this._$wrapElement('li', navLabel));

			this._menuUserLinks.map(([requiredUserFlags, linkAttributes]) =>
				(currentUserFlags & requiredUserFlags) && container.appendChild(this._$menuLinkItem(linkAttributes))
			);

			return [container];
		}

		_renderMenu (sections) {
			const renderedSections = sections.map(section =>
				this._renderSection(section)
			);

			const container = this._dom.document.createElement('div');

			container.classList.add('menu', 'view-border-box');

			const userSection = this._renderUserSection();

			[
				...renderedSections,
				...userSection
			].forEach(renderedSection =>
				container.appendChild(renderedSection)
			);

			return container;
		}

		_processMenu ({err, data}) {
			if (err) {
				return this._handleError(err);
			}

			assert(data, 'Data is not trueish');
			assert(data.constructor === String, 'Data is 	not a string');

			const {sections} = this._parseMenu(data);

			const renderedMenuSections = this._renderMenu(sections);

			const _menu = this._dom.menu;
			const _menuParent = _menu.parentNode;

			_menuParent.removeChild(_menu);
			_menuParent.appendChild(renderedMenuSections);

			return /* bail */;
		}

		_retrieveSidebar () {
			++this._retryCount;

			this._genericXhr('GET', this._menuPath, null, false, (err, data) =>
				this.emit('sidebar', {err, data})
			);
		}

		_setup () {
			this._setupBus();
			this._retrieveSidebar();
		}

		static initialize ({dom, userState}) {
			const mfMenu = new MfMenu(dom, {userState});

			mfMenu._setup();

			return mfMenu;
		}
	}

	class UserState {
		constructor() {
			this._userName = null;
			this._userFlags = 0;

			this._flags = {
				ANON:  0b0001,
				USER:  0b0010,
				ADMIN: 0b0100,
				SYSOP: 0b1000
			};

			this._populateUser();
			this._populatePage();
		}

		_hasMWMetadata () {
			return 'mw' in window && 'config' in window.mw;
		}

		_populateUser () {
			if (this._hasMWMetadata()) {
				this._userName = mw.config.values.wgUserName;

				if (this._userName === null)
					this._userFlags ^= this._flags.ANON;

				const userGroups = new Set(mw.config.values.wgUserGroups);

				if (userGroups.has('user'))
					this._userFlags ^= this._flags.USER;

				if (userGroups.has('admin'))
					this._userFlags ^= this._flags.ADMIN;

				if (userGroups.has('sysop'))
					this._userFlags ^= this._flags.SYSOP;
			}
		}

		/* User API */

		getUserName () {
			return this._userName;
		}

		getUserFlags () {
			return this._userFlags;
		}

		isLoggedIn () {
			return this._userName !== null;
		}

		/* Page API */

		_populatePage () {
			if (this._hasMWMetadata()) {
				this._pageName = mw.config.values.wgPageName;
			}
		}

		getPageName () {
			return this._pageName;
		}
	}

	const initializeMenu = () => {
		const menu = document.querySelector('.navigation-drawer .menu');
		const userState = new UserState;

		MfMenu.initialize({
			dom: {document, menu}, userState
		});
	};

	/* do not attach load event handler after page is loaded */
	if (document.readyState === 'complete') {
		initializeMenu();
	} else {
		window.addEventListener('load', initializeMenu);
	}
};