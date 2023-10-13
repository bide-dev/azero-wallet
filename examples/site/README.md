# TypeScript Example Snap Front-end

This project is based on [MetaMask/template-snap-monorepo](https://github.com/MetaMask/template-snap-monorepo).

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm build`

Builds the app for production to the `public` folder.\
It correctly bundles React in production mode and optimizes the build for the best
performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/) for
more information.

## Environment variables

Gatsby has built-in support for loading environment variables into the browser
and Functions. Loading environment variables into Node.js requires a small code
snippet.

In development, Gatsby will load environment variables from a file named
`.env.development`. For builds, it will load from `.env.production`.

By default, you can use the `SNAP_ORIGIN` variable (used in
`src/config/snap.ts`) to define a production origin for you snap (e.g.
`npm:MyPackageName`). If not defined it will default to
`local:http://localhost:8080`.

A `.env` file template is available, to use it rename `.env.production.dist` to
`.env.production`
