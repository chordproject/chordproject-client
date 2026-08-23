# ChordProject Client

Web client for [ChordProject](https://chordproject.com), built with Angular and Firebase for creating, editing, reading, and organizing songs using ChordPro notation.

## Features

- Create and edit songs with chords and lyrics.
- Search songs by title and lyrics.
- Organize songs into personal songbooks.
- Read songs with transposition, zoom, auto-scroll, and configurable typography.
- Synchronize songs and songbooks through Firebase.
- Spanish, English, and French translations.
- Light and dark themes based on the Fuse Angular design system.

## Requirements

- Node.js 24 or newer.
- npm.
- A Firebase project configured in `src/environments/environment.ts`.

## Development

Install dependencies and start the local server:

```bash
npm install
npm start
```

Open `http://localhost:3873/` in a browser.

## Build and tests

```bash
npm run build
npm test
```

The production build is written to `dist/`.

## Contributing

1. Fork the repository and clone your fork.
2. Use Node.js 24 or newer. With `nvm`, run `nvm use` from the repository root.
3. Install dependencies with `npm install`.
4. Configure the Firebase project in `src/environments/environment.ts`. Never commit service-account files, private keys, or other server credentials.
5. Create a focused branch from `main`:

    ```bash
    git switch -c type/short-description
    ```

    Use a branch type such as `feature`, `fix`, or `docs`.

6. Make the smallest change that solves the issue and keep unrelated formatting or refactoring out of the branch.
7. Run the available checks before opening a pull request:

    ```bash
    npm run build
    npm run lint
    npm test
    ```

8. Describe the behavior changed, the checks completed, and any Firebase or browser setup needed to reproduce it.
9. Open a pull request against `main`. Keep commits short and focused on the functionality they implement.

## Inspiration

- [UkeGeeks](https://github.com/buzcarter/UkeGeeks)
- [ChordBook](https://github.com/chordbook/chordbook)
- [Fuse Angular Material](https://angular-material.fusetheme.com/)

Also thanks to the ideas and collaboration of [edwinzap](https://github.com/edwinzap).

## Related projects

- [ChordPro Parser](https://github.com/chordproject/chordpro-parser)
- [ChordProject Editor](https://github.com/chordproject/chordpro-editor)
- [HomenaJesus](https://homenajesus.com), the Christian music platform built on the same ecosystem.

## License

This project includes the Fuse Angular template and remains subject to the license terms documented in [LICENSE.md](LICENSE.md).
