const { readdirSync, statSync } = require('node:fs')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')
const sourceDirectories = [
  path.join(projectRoot, 'src'),
  path.join(projectRoot, 'scripts'),
]

function listJavaScriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = path.join(directory, entry)

    if (absolutePath === __filename) {
      return []
    }

    return statSync(absolutePath).isDirectory()
      ? listJavaScriptFiles(absolutePath)
      : absolutePath.endsWith('.js')
        ? [absolutePath]
        : []
  })
}

const files = sourceDirectories.flatMap(listJavaScriptFiles)

for (const file of files) {
  const result = spawnSync(
    process.execPath,
    ['--check', file],
    { stdio: 'inherit' },
  )

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

console.log(`Sintaxis verificada en ${files.length} archivos.`)
