import {
    createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createQuarkusApp, cloneQuarkusQuickstart } from '@qshift/plugin-quarkus-backend';
import { mavenDependenciesAdd } from '@qshift/plugin-maven-backend';

export const scaffolderBackendModuleQShift = createBackendModule({
    moduleId: 'scaffolder-backend-module-qshift',
    pluginId: 'scaffolder',
    register(env) {
        env.registerInit({
            deps: {
                scaffolder: scaffolderActionsExtensionPoint,
            },
            async init({ scaffolder }) {
                scaffolder.addActions(
                    createQuarkusApp(),
                    cloneQuarkusQuickstart(),
                    mavenDependenciesAdd(),
                );
            },
        });
    },
});