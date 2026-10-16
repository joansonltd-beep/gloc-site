# Private insurance product library

The activity tracker links to `/dashboard/library`. The page and every export request check the existing dashboard session on the server. Exports return private, no-store responses. The library contains public-source research only, not prospect or activity records.

The research index is `src/lib/dashboard/product-library.json`. Every product has source IDs, optional document IDs, published status and verification IDs. Names and categories are evidence of published references, not confirmation of current policy terms, availability or agency distribution rights. Original PDFs are linked to their source hosts; newsletters, forms, webpage exports and brochures remain separate document types. PDFs are not copied into the public website repository.

`library-export.ts` generates the Markdown research pack, CSV table and source list from that same index. All exports include the relevant verification status; the full research export includes the issue and source registers. Original brochures can be downloaded from their carrier links. The locally delivered NotebookLM ZIP additionally contains unmodified PDFs and a provenance/checksum manifest. Unzip it before uploading individual sources to NotebookLM.

## Maintenance

1. Obtain current, dated carrier documents and written answers to the verification register.
2. Update the relevant source and entry rather than replacing disputed figures silently.
3. Keep Jamaican-dollar and Cayman-issued USD variants separate, and do not promote pending broker appointments to confirmed availability.
4. Recheck the research date, missing documents and carrier new-business status.
5. Run type checking, production build, export-integrity and browser checks before deployment.

## Validation

- `node tests/product-library.cjs` checks unique IDs, source references, offshore status and export coverage.
- Set `LIBRARY_EXPORT_DIR` to an absolute output directory to write matching user deliverables during that test.
- `node tests/library-browser.cjs` expects a local production server at `http://localhost:51477` with `DASHBOARD_PASSWORD=local-library-validation-2026` and a dummy `BLOB_STORE_ID`. These are local validation values only. The test issues a local signed session; it does not use the production password or read/write activity storage.
- Browser checks require Playwright. `PLAYWRIGHT_MODULE_PATH` can point to an installed Playwright package; `TEST_BROWSER_CHANNEL` optionally selects an installed browser such as `msedge`. Set `LIBRARY_EXPORT_DIR` for screenshots, otherwise they are saved under `test-results`.
- The browser test verifies anonymous page/export protection, authenticated exports, search, filters, legacy/offshore separation, issue cards, empty results, download interaction, mobile overflow and page errors.

## Rollback

The pre-library commit is `413aa699a39d812e758e30d3889d4cf917dacd04`, also retained by local branch `rollback/product-library-20261016`. Revert the product-library commit using the required commit author, fetch and reconcile main, run type checking and the production build, and push normally. Reverting the library does not delete private tracker data. Existing pre-chat rollback archives remain separate and unchanged.
