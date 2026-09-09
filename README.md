# Portfolio v4

My portfolio at [raigeki.dev](https://raigeki.dev) — React + Vite, no UI framework.
The whole page is one screen: a canvas thunderstorm behind the hero, a KanjiVG
intro that draws 雷撃 stroke by stroke, and a contact flow that asks three
questions instead of showing a form.

## Development

```bash
pnpm install
pnpm dev      # vite dev server
pnpm build    # production build into dist/
pnpm preview  # serve the build locally
```

## Structure

```
src/
  App.jsx            page composition + shared state
  components/        the component tree (nav, hero, work, about, contact …)
  hooks/             useLoader, useStorm, useViewport, useContactFlow
  constants/         I18N, KanjiVG stroke data, projects, stack, storm presets
  index.css          all styling, values taken 1:1 from the design file
```

`App` takes two props:

| Prop         | Values                            | Default      | What it does                              |
| ------------ | --------------------------------- | ------------ | ----------------------------------------- |
| `storm`      | `subtil` \| `deutlich` \| `wucht` | `deutlich`   | Intensity of the canvas thunderstorm      |
| `showLoader` | `true` \| `false`                 | `true`       | Skips the KanjiVG intro when `false`      |

The storm presets live in `src/constants/index.js` (`STORM_PRESETS`) — drop count,
speed, glow and the pause between two bolts.

## Language

German and English, detected from `navigator.language` and remembered under the
localStorage key `raigeki.lang`. All copy sits in `I18N` in `src/constants`.

## Credits

The stroke data for the intro animation comes from
[KanjiVG](https://kanjivg.tagaini.net) by Ulrich Apel, licensed under
[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

## History

This is the fourth portfolio; the text below is how I described v3, the ThreeJS one.

> In my first portfolio I already worked with TreeJS. I had something similar to what I have now in the third version: A 3D model of a desk in the Hero section. However, the rest of my first portfolio was very basic and rather outdated in design.
>
> That was the reason why I created a completely new portfolio only 6 months later. This one had nothing to do with ThreeJS. There I tried to create a nice website with snapped pages. Unfortunately, the portfolio worked great on a desktop PC, but on cell phones or generally on smaller screens some content overlapped, which is why I was not really satisfied with it. Also, I was able to fix it, however, I was not very satisfied with the overall experience on the site.
>
> Now here is my third version - I am very happy with it. Again with TreeJS, this time very precise and good work, I think. Also, the website is now perfectly responsive (feel free to correct me, if I didn't see something). Now, there is more important informations on this portfolio like my main stack of langauges and frameworks I use at the moment, my work experience, my projects and also a small contact form, of course.
