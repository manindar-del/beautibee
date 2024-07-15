
# SET UP
`npm i --force`

# Run dev server
 `npm run dev`

# Feature Added :

- Redux toolkit setup
- module scss style guide
- private route example in the /pages/privatepage/index.js file
- axios instance for making api calls
- mui integration
- PWA integrated + offline support
- MUI style cache on server
- Strict ESLINT
- Proper Git commit Set up
- on git commit eslint will be executed
- no console log , no unused var , no unused import , react key is important
- Lootie added
- 404 page , 500 page , offline page

# UPCOMING 

- React query
- Typescript
- Encrypt/Decrypt local/session storage
- lazy load functions
- Detect online / offline realtime
- redux state sync on multiple tab

#
# FOLDER STUCTURE



├───.vscode  => `contains vs code settings`
├───API
│   ├───Endpoints => `list off all api endpoints as per api doc`
│   └───functions => `All api functions will list here`
├───Axios => `axiosInstance will list here`
├───Components => `All reusable component will list here`
│   ├───OfflineModal 
│   ├───ProductCard
│   └───SEO
├───CONFIG => ` firebase config , socket config , any other config`
├───docs => `for documentation`
├───Hooks => `For all reusable react hooks`
├───JSON => `for all client side json data`
│   └───lottie
├───LAYOUT => `For setting up layout only`
│   ├───Footers
│   ├───Headers
│   └───Wrappers
├───lib => `all reusable function will list here`
│   ├───functions
│   └───regex
├───pages => `all pages will listed here`
│   ├───about
│   ├───design
│   ├───login
│   └───privatepage
├───public => `all assets , pwa icon will listed here`
│   └───assets
│       ├───icons
│       └───images
├───ReduxToolkit => `For redux toolkit`
├───styles => `for scss`
│   ├───abstracts => `for all variables`
│   ├───base
│   ├───components => `for all component related scss`
│   ├───layout => `for layout related scss`
│   └───pages  => `for all pages scss`
├───themes => `material ui set up`
│   ├───overrides
│   └───theme
└───ui => `all reusable ui component will go here`
    ├───alerts
    ├───Buttons
    │   └───MyButton
    ├───Cards
    │   └───ProductCardWrapper
    ├───Chips
    ├───Inputs
    │   └───LoginPageInput
    ├───Labels
    ├───Modals
    ├───Skeletons
    ├───Spinners
    └───Toastify
        └───ToastifyMain
|__ middleware.js => `for private


# GUIDE LINES




## DESIGN 
=========

- MUST DECLEARE ALL THE COLOR CODES INSIDE    `styles\abstracts\_variable.module.scss`

- ALL COMPONENT SCSS AND UI component scss must live in  `styles\components\**`

- ALL LAYOUT RELATED SCSS MUST LIVE INSIDE `styles\layout\**`

- ALL Pages related scss must live inside `styles\pages\**` 

- All button , input , modal , skeleton , alerts , 
typography , spinners must live inside `ui/**`

- Must use @mui items . No bootstrap

- USE COLOR CODES AS VARIABLE IN ALL SCSS FILE 


## DEVELOPMENT
==============

- all api endpoint must listed in `API/Endpoints` folder
- all api functions will be listed in `API/functions` folder
- only use axiosInstance 
- Must use reusable component, which will be listed in `/Components` folder

- Rule for React component:
  - Must use funtional component
  - Must declear Valid prop-types
  - Must use defaultProps 
  - All component must be memorized , use memo component

- all react  hooks must be listed in `hooks` folder
- all json data will be listed in `JSON` folder
- header , footer , wrapper must be listed in `Layout` folder
- all reusable function will be listed in `lib` folder
- all assets in `public` folder
- all ui component must listed in `ui` folder
- all private page routing will be donw from `middleware.js`
- MUST follow eslint ,(No one can edit , eslint );
- Must use MUI only
  => https://mui.com/

- no inline loop , fiter 

# GIT PUSH RULES

## Proper commit :

https://www.freecodecamp.org/news/how-to-use-commitlint-to-write-good-commit-messages/


build: changes affecting build systems or external dependencies
ci: updating configuration files for continuous integration and deployment services
chore: updating grunt tasks etc.; no production code change
docs: documentation-only changes
feat: a new feature
fix: a bug fix
perf: a code change that improves performance
refactor: a code change that neither fixes a bug nor adds a feature
style: changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
test: adding missing tests or correcting existing tests

- Example 
    `git commit -m "feat: added login feature"`
# beautibee
# beautibee
