import replace from "replace-in-file";

const DEV = process.env.NODE_ENV === "development";

const SNAP_ID = DEV ? "local:http://localhost:8081/" : "npm:aleph-zero-snap";

replace.replaceInFileSync({
    files: ["build/consts.d.ts", "build/consts.js"],
    from: "__SNAP_ID__",
    to: SNAP_ID,
});

export { };
