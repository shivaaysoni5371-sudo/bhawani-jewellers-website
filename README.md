# Bhawani Jewellers Website

A static storefront for Bhawani Jewellers with a product gallery, daily gold/silver rates, contact details, appointment form, and a demo admin panel.

## Free domain publishing

This repository is ready to publish on **GitHub Pages**, which provides a free `github.io` domain.

### GitHub Pages URL format

After deployment, the free domain will be:

```text
https://<github-username>.github.io/<repository-name>/
```

For example, if the repository is named `bhawani-jewellers-website`, the URL will look like:

```text
https://<github-username>.github.io/bhawani-jewellers-website/
```

### How to publish

1. Push this repository to GitHub on the `main` or `master` branch.
2. Open the repository on GitHub.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions** as the source.
5. The included workflow at `.github/workflows/pages.yml` will publish the site automatically.
6. Open the deployment URL shown in the workflow summary or in **Settings → Pages**.

## Local preview

Run a local static server from the repository root:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Demo admin panel

The static demo admin panel uses browser-only storage for preview purposes. Admin credentials are not printed on the public page or in this README.
## Demo admin login

The static demo admin panel uses browser-only storage for preview purposes.

```text
Username: Sawai_soni066
Password: Sawai6367@8444
```

For a production website, move admin authentication, image uploads, and gold-price updates to a secure backend/database.
