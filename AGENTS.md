<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## AYANFE application rules
- Share navigation and session conversation state through root-level providers; this keeps tool pages and conversation URLs inside one application.
- Keep demo conversations in React memory with route-derived thread IDs; the first milestone must not provision services or retain user data after refresh.
- Use AI Elements for transcript, markdown, composer, and loading primitives; shared chat foundations support a later secure streaming integration.
- Keep each planned tool on its own content route with route-specific metadata; future tools can grow without crowding the mobile chat experience.
- Define brand styling and semantic palette in the global stylesheet; reusable page classes keep presentation consistent.
