# docs-theme

The Hugo theme for the documentation of every php-sso repository. It looks like the
[php-sso website](https://php-sso.github.io/): a deep indigo band on top, a light page below (dark when the
system is dark), IBM Plex type, and colour that means something.

It has no dependencies and makes no requests to other sites: fonts, search and syntax colours are all served from the
documentation itself.

## What you get

- A sidebar built from your content folders, an "On this page" list, and previous and next links.
- Search over all pages (press `/`), with no service behind it: Hugo writes `index.json`, a little script reads it.
- Code blocks with syntax colours (light and dark) and a copy button.
- GitHub callouts: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`. The same Markdown reads well on GitHub.
- A `way` shortcode for the coloured chips of the ways into php-sso: `{{</* way saml */>}}`, `{{</* way scim */>}}`.
- An "Edit this page on GitHub" link, a 404 page, a sitemap and `robots.txt`, and a print style.

## Colour

The `accent` parameter picks the hue of the repository, using the same hues as the website:

| Repository | `accent` | Colour |
| --- | --- | --- |
| `php-sso` | `core` | indigo |
| `oauth-server` | `oidc` | green |
| `saml` | `saml` | teal |
| `scim-server` | `scim` | berry |

It colours the line under the header, the rules over headings, the current page in the sidebar, bullets and notes.
Warnings and cautions use the yellow highlighter instead, so they never look like a way in.

## Use it in a repository

Documentation lives in a `docs/` folder of each repository, as a small Hugo site:

```
docs/
  hugo.toml
  go.mod
  content/
    _index.md           the home page
    installation.md
    configuration.md
    guides/
      _index.md
      theming.md
```

1. Copy `exampleSite/hugo.toml` to `docs/hugo.toml` and change the lines marked `CHANGE`. Delete the `replacements` line.
2. Create `docs/go.mod` (Hugo Modules need Go installed):

   ```bash
   cd docs
   hugo mod init github.com/php-sso/<repository>/docs
   hugo mod get github.com/php-sso/docs-theme@latest
   ```

3. Put Markdown in `docs/content/`. Every page starts with front matter:

   ```yaml
   ---
   title: Theming
   weight: 3        # the order in the sidebar
   lead: One sentence under the title.   # optional
   ---
   ```

4. Copy `exampleSite/pages-workflow.yml` to `.github/workflows/docs.yml` and set Pages "Source" to "GitHub Actions".

Look at it locally with `hugo server --source docs`.

### Why some settings are not in the theme

Hugo only takes `params` from a theme, so settings such as `[outputs]` (needed for search) and `disableKinds` have to be
in the site's own `hugo.toml`. That is why you copy the example file instead of starting empty.

## Parameters

| Parameter | What it does |
| --- | --- |
| `accent` | `core`, `password`, `saml`, `social`, `scim` or `oidc` |
| `description` | The sentence under the title on the home page, and the page description |
| `repo` | The GitHub address of the repository. Adds the icon in the header and the edit links |
| `branch` | The branch for edit links (default `master`) |
| `editPath` | The folder that holds `content/` (default `docs`) |
| `nav` | Extra links in the header: `[[params.nav]]` with `name` and `url` |
| `license` | Shown in the footer |
| `logo` | A different logo (a path under `assets/`) |

Per page: `title`, `weight`, `lead`, `description`, and `toc: false` to hide "On this page".

## Change the theme

Everything is plain CSS in `assets/css/docs.css`, with the colours as variables at the top, the same names the website
uses. A site can override any file by putting one with the same path in its own `layouts/` or `assets/`.
`layouts/_partials/head-extra.html` is empty for adding things to `<head>`.

Work on the theme with the example site:

```bash
cd exampleSite
hugo server
```

Keep the look in step with the website: when `assets/site.css` there changes colours or type, change the variables here.
Fonts are IBM Plex (headings, interface, code) and Source Serif 4 (body text), both under the SIL Open Font License (`assets/fonts/OFL.txt`).

## License

MIT, see `LICENSE`.
