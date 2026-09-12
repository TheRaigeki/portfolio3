# raigeki.dev

Portfolio site, React + Vite, no UI framework. See README.md for structure and
commands.

## The "Next project" tile stays in the code

The coming-soon tile in the work grid (`src/components/ComingSoonCard.jsx`,
`src/hooks/useSoonStorm.js`, the `.card--soon` / `.soon-canvas` styles in
`src/index.css`) is a finished piece: a framed version of the hero's
thunderstorm with a procedurally generated bolt that strikes on its own and on
hover.

When asked to remove the tile, only take it off the page: drop the
`<ComingSoonCard />` render in `src/components/Work.jsx` and leave the
component, hook, styles and i18n strings (`soonKind`, `soonTitle`, `soonText`)
in place. Do not delete those files or clean them up as "unused" unless the
deletion is requested explicitly. The tile comes back whenever a larger project
is in the works again, and it has to be a one-line change to re-add it.
