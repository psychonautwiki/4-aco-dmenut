'use strict';

{
	function EventHandlers(){}function EventEmitter(){EventEmitter.init.call(this)}function $getMaxListeners(e){return void 0===e._maxListeners?EventEmitter.defaultMaxListeners:e._maxListeners}function emitNone(e,t,n){if(t)e.call(n);else for(var r=e.length,i=arrayClone(e,r),s=0;r>s;++s)i[s].call(n)}function emitOne(e,t,n,r){if(t)e.call(n,r);else for(var i=e.length,s=arrayClone(e,i),o=0;i>o;++o)s[o].call(n,r)}function emitTwo(e,t,n,r,i){if(t)e.call(n,r,i);else for(var s=e.length,o=arrayClone(e,s),a=0;s>a;++a)o[a].call(n,r,i)}function emitThree(e,t,n,r,i,s){if(t)e.call(n,r,i,s);else for(var o=e.length,a=arrayClone(e,o),u=0;o>u;++u)a[u].call(n,r,i,s)}function emitMany(e,t,n,r){if(t)e.apply(n,r);else for(var i=e.length,s=arrayClone(e,i),o=0;i>o;++o)s[o].apply(n,r)}function _addListener(e,t,n,r){var i,s,o;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');return s=e._events,s?(s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),s=e._events),o=s[t]):(s=e._events=new EventHandlers,e._eventsCount=0),o?("function"==typeof o?o=s[t]=r?[n,o]:[o,n]:r?o.unshift(n):o.push(n),o.warned||(i=$getMaxListeners(e),i&&i>0&&o.length>i&&(o.warned=!0,console.warn("Possible EventEmitter memory leak detected. $ {\n                    existing.length\n                }\n                $ {\n                    type\n                }\n                listeners added.Use emitter.setMaxListeners() to increase limit")))):(o=s[t]=n,++e._eventsCount),e}function _onceWrap(e,t,n){function r(){e.removeListener(t,r),i||(i=!0,n.apply(e,arguments))}var i=!1;return r.listener=n,r}function listenerCount(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function spliceOne(e,t){for(var n=t,r=n+1,i=e.length;i>r;n+=1,r+=1)e[n]=e[r];e.pop()}function arrayClone(e,t){for(var n=Array(t);t--;)n[t]=e[t];return n}var domain;EventHandlers.prototype=Object.create(null),EventEmitter.EventEmitter=EventEmitter,EventEmitter.usingDomains=!1,EventEmitter.prototype.domain=void 0,EventEmitter.prototype._events=void 0,EventEmitter.prototype._maxListeners=void 0;var defaultMaxListeners=10;Object.defineProperty(EventEmitter,"defaultMaxListeners",{enumerable:!0,get:function(){return defaultMaxListeners},set:function(e){defaultMaxListeners=e}}),EventEmitter.init=function(){this.domain=null,EventEmitter.usingDomains&&(domain=domain||require("domain"),!domain.active||this instanceof domain.Domain||(this.domain=domain.active)),this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=new EventHandlers,this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},EventEmitter.prototype.setMaxListeners=function(e){if("number"!=typeof e||0>e||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},EventEmitter.prototype.getMaxListeners=function(){return $getMaxListeners(this)},EventEmitter.prototype.emit=function(e){var t,n,r,i,s,o,a,u=!1,l="error"===e;if(o=this._events)l=l&&null==o.error;else if(!l)return!1;if(a=this.domain,l){if(t=arguments[1],!a){if(t instanceof Error)throw t;var m=Error('Uncaught, unspecified "error" event. ('+t+")");throw m.context=t,m}return t||(t=Error('Uncaught, unspecified "error" event')),t.domainEmitter=this,t.domain=a,t.domainThrown=!1,a.emit("error",t),!1}if(n=o[e],!n)return!1;a&&this!==process&&(a.enter(),u=!0);var v="function"==typeof n;switch(r=arguments.length){case 1:emitNone(n,v,this);break;case 2:emitOne(n,v,this,arguments[1]);break;case 3:emitTwo(n,v,this,arguments[1],arguments[2]);break;case 4:emitThree(n,v,this,arguments[1],arguments[2],arguments[3]);break;default:for(i=Array(r-1),s=1;r>s;s++)i[s-1]=arguments[s];emitMany(n,v,this,i)}return u&&a.exit(),!0},EventEmitter.prototype.addListener=function(e,t){return _addListener(this,e,t,!1)},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.prependListener=function(e,t){return _addListener(this,e,t,!0)},EventEmitter.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,_onceWrap(this,e,t)),this},EventEmitter.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,_onceWrap(this,e,t)),this},EventEmitter.prototype.removeListener=function(e,t){var n,r,i,s,o;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(r=this._events,!r)return this;if(n=r[e],!n)return this;if(n===t||n.listener&&n.listener===t)0===--this._eventsCount?this._events=new EventHandlers:(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,s=n.length;s-->0;)if(n[s]===t||n[s].listener&&n[s].listener===t){o=n[s].listener,i=s;break}if(0>i)return this;if(1===n.length){if(n[0]=void 0,0===--this._eventsCount)return this._events=new EventHandlers,this;delete r[e]}else spliceOne(n,i);r.removeListener&&this.emit("removeListener",e,o||t)}return this},EventEmitter.prototype.removeAllListeners=function(e){var t,n;if(n=this._events,!n)return this;if(!n.removeListener)return 0===arguments.length?(this._events=new EventHandlers,this._eventsCount=0):n[e]&&(0===--this._eventsCount?this._events=new EventHandlers:delete n[e]),this;if(0===arguments.length){for(var r,i=Object.keys(n),s=0;s<i.length;++s)r=i[s],"removeListener"!==r&&this.removeAllListeners(r);return this.removeAllListeners("removeListener"),this._events=new EventHandlers,this._eventsCount=0,this}if(t=n[e],"function"==typeof t)this.removeListener(e,t);else if(t)do this.removeListener(e,t[t.length-1]);while(t[0]);return this},EventEmitter.prototype.listeners=function(e){var t,n,r=this._events;return r?(t=r[e],n=t?"function"==typeof t?[t]:arrayClone(t,t.length):[]):n=[],n},EventEmitter.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):listenerCount.call(e,t)},EventEmitter.prototype.listenerCount=listenerCount,EventEmitter.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]};
	const events = EventEmitter;

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
			if(/^(https?|ftp):\/\//i.test(anchorLink)){
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
			return 'mw' in window && 'config' in window['mw'];
		}

		_populateUser () {
			if (this._hasMWMetadata()) {
				this._userName = window['mw']['config']['get']('wgUserName');

				if (this._userName === null)
					this._userFlags ^= this._flags.ANON;

				const userGroups = new Set(window['mw']['config']['get']('wgUserGroups'));

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
				this._pageName = window['mw']['config']['get']('wgPageName');
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
		window['addEventListener']('load', initializeMenu);
	}
};