# 4-aco-dmenut

A mediawiki MobileFrontend replacement rendering the desktop sidebar.

## Building

```
$ npm install
$ make
```

or - as we do - just copy and paste common.js into closure-compiler using advanced mode.

## Usage

Copy `build.js` into `MediaWiki:mobile.js`. Beware that custom styles _may_ need to be applied, most prominently icon-inversion styles if you want to reuse desktop icons. You can also add different icon classes with mobile-taylored images.

### Menu customization

You _might_ want to add styling to your `MediaWiki:mobile.css` to improve readability and usability of the menu.

Here's the specific styling used for 4-aco-dmenut on [PsychonautWiki](https://psychonautwiki.org/wiki/Main_Page):

```
/* sidebar */

body.skin-minerva .menu li.mw-ui-menu-current-page {
	background-color: #8c8c8c;
	border-left: solid 12px #FFFFFF;
	margin-left: -12px;
}

body.skin-minerva .menu li h3 {
	color: #b3b3b3;
    font-weight: 500;
    padding: 15px;
    margin: 0;
}

body.skin-minerva .menu li a.mw-ui-icon, body.skin-minerva .menu li a.mw-ui-icon:active, body.skin-minerva .menu li a.mw-ui-icon:visited {
	color: #bfbfbf;
}

/* fix logout button margin */
body.skin-minerva .menu ul.mw-ui-menu-user-section li .mw-ui-icon.mw-ui-icon-secondary-logout:before {
	margin: 0 0.5em;
}
```

## Roadmap

- Make the user section of the menu configurable via an external script or json file
- Optionally, allow rendering a custom, static menu, thereby not requiring a request for the sidebar (_MediaWiki:Sidebar_)
- Simplify user flag management of menu items
- Utilize event bus inherited by MfMenu for providing dynamic menu items without anchor links

## License

Unlicensed, go crazy. But if you find bugs or have feature proposals, please raise an issue. - apx
