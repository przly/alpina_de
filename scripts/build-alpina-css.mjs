// Mirrors the Alpina repo's gulp CSS task: compile scss/style.scss + every component .scss
// on its own, then concatenate the results into one bundle.css.
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileAsync } from 'sass-embedded'

const root = fileURLToPath(new URL('../src/alpina/', import.meta.url))
const outDir = join(root, 'css')

const findScss = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return findScss(path)
    return entry.name.endsWith('.scss') && !entry.name.startsWith('_') ? [path] : []
  })

const files = [join(root, 'scss/style.scss'), ...findScss(join(root, 'components')).sort()]

const chunks = []
for (const file of files) {
  const { css } = await compileAsync(file, { silenceDeprecations: ['import', 'global-builtin', 'slash-div', 'mixed-decls', 'color-functions'], quietDeps: true, logger: { warn() {} } })
  chunks.push(`/* ${relative(root, file)} */\n${css}`)
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'bundle.css'), chunks.join('\n\n'))
console.log(`alpina css: ${files.length} files → src/alpina/css/bundle.css`)
