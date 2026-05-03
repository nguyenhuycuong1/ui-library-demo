import {
  Tree,
  formatFiles,
  generateFiles,
  names,
  joinPathFragments,
  addProjectConfiguration,
  readProjectConfiguration,
} from '@nx/devkit';
import { join } from 'path';

interface ComponentGeneratorSchema {
  name: string;
  withCva?: boolean;
}

export default async function componentGenerator(
  tree: Tree,
  options: ComponentGeneratorSchema,
): Promise<void> {
  const { name, withCva = false } = options;
  const n = names(name);

  const projectRoot = `libs/components/${n.fileName}`;

  // ---- 1. Register project in Nx graph ----
  addProjectConfiguration(tree, n.fileName, {
    root: projectRoot,
    sourceRoot: `${projectRoot}/src`,
    projectType: 'library',
    targets: {},
    tags: ['scope:components', 'type:lib'],
  });

  // ---- 2. Scaffold files from templates ----
  generateFiles(
    tree,
    join(__dirname, 'files'),
    projectRoot,
    {
      ...n,
      withCva,
      tmpl: '',  // strips __tmpl__ suffix from template files
    },
  );

  // ---- 3. Register path in tsconfig.base.json ----
  const tsconfig = JSON.parse(tree.read('tsconfig.base.json', 'utf-8')!);
  tsconfig.compilerOptions.paths[`@ui/${n.fileName}`] = [
    `${projectRoot}/src/index.ts`,
  ];
  tree.write('tsconfig.base.json', JSON.stringify(tsconfig, null, 2));

  await formatFiles(tree);
}
