# Task Completion Checklist

When completing any development task in this project, follow these steps:

## Before Starting
1. **Pull latest changes**: `git pull origin main`
2. **Install dependencies**: `pnpm install`
3. **Start dev server**: `pnpm run dev`

## During Development
1. **Follow TypeScript strict mode** - No `any` types
2. **Use proper component patterns** - Functional components with hooks
3. **Apply Tailwind classes** - Maintain consistent styling
4. **Test in both themes** - Check dark and light mode
5. **Ensure responsive design** - Test different screen sizes

## Before Committing
1. **Run linter**: `pnpm run lint`
   - Fix all ESLint errors and warnings
   - Follow Next.js best practices

2. **Check TypeScript**: `pnpm tsc --noEmit`
   - Ensure no type errors
   - Verify all imports are correct

3. **Test build**: `pnpm run build`
   - Confirm production build succeeds
   - Check for any build warnings

4. **Manual testing**:
   - Test new features in browser
   - Check console for errors
   - Verify mobile responsiveness
   - Test dark/light mode toggle

5. **Review changes**: `git diff`
   - Ensure no debug code remains
   - Check for sensitive information
   - Verify code follows conventions

## Commit Standards
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Write clear, descriptive messages
- Reference issues if applicable

## Final Checks
- [ ] Code passes lint (`pnpm run lint`)
- [ ] TypeScript has no errors
- [ ] Build succeeds (`pnpm run build`)
- [ ] Features work in both themes
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors or warnings
- [ ] Code follows project conventions
- [ ] Commit message is descriptive