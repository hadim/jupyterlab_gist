import { IDisposable, DisposableDelegate } from '@phosphor/disposable';

import { JSONObject } from '@phosphor/coreutils';

import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import { ToolbarButton } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  //NotebookActions,
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';

import { ISettingRegistry } from '@jupyterlab/coreutils';

import { GistService } from './gistService';
import * as actions from './actions';
import * as utils from './utils';

import '../style/index.css';

/**
 * The plugin registration information.
 */
const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'jupyterlab_gist',
  autoStart: true,
};

export interface IGistInfoMetadata extends JSONObject {
  gist_url?: string;
  gist_id?: string;
}

/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export class GistButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  public settingRegistry: ISettingRegistry = null;

  /**
   * Create a new extension object.
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>,
  ): IDisposable {
    const metadata = panel.model.metadata;

    // Init notebook metadata
    if (!metadata.has('gist_info')) {
      // TODO: would be nice to keep the post date.
      metadata.set('gist_info', { gist_url: null, gist_id: null });
    }
    const gist_info = metadata.get('gist_info') as IGistInfoMetadata;

    const token = '32858451940f89efc027bb4697e3e2b9b0de616c';
    console.log(context);
    console.log(this.settingRegistry);

    let gistService = new GistService(token);
    gistService = null;

    let postGistCallback = () => {
      const title = panel.title['_label'];
      const content = panel.model.toString();

      let files = { title: content };

      console.log('Sending the gist request now for ' + title + '.');

      gistService
        .publishGist(files, null)
        .then(result => {
          gist_info['gist_url'] = result['html_url'];
          gist_info['gist_id'] = result['id'];

          console.log(
            'The gist for ' +
              title +
              ' is available at ' +
              gist_info['gist_url'],
          );

          // Need to be authtenticated to delete gist
          deleteButton.setHidden(true);
          copyURLButton.setHidden(false);
        })
        .catch(error => console.error(error));
    };

    let postButton = new ToolbarButton({
      iconClassName: 'jp-Gist-PostGistButton',
      onClick: postGistCallback,
      tooltip: 'Post Gist',
    });

    let deleteGistCallback = () => {
      actions;
      // .deleteGistRequest(gist_info['gist_id'])
      // .then(() => {
      //   console.log(
      //     'Delete gist for ' +
      //       panel.title['_label'] +
      //       ': ' +
      //       gist_info['gist_url'],
      //   );
      //   deleteButton.setHidden(true);
      //   copyURLButton.setHidden(true);
      // })
      // .catch(error => console.error(error));
    };

    let deleteButton = new ToolbarButton({
      iconClassName: 'jp-Gist-DeleteGistButton',
      onClick: () => deleteGistCallback,
      tooltip: 'Delete Gist',
    });

    let copyURLGistCallback = () => {
      actions.copyToClipboard(gist_info['gist_url']);
      console.log('URL copied to clipboard');
      console.log(
        'The gist for ' +
          panel.title['_label'] +
          ' is available at ' +
          gist_info['gist_url'],
      );
    };

    let copyURLButton = new ToolbarButton({
      iconClassName: 'jp-Gist-CopyURLGistButton',
      onClick: copyURLGistCallback,
      tooltip: 'Copy URL Gist to clipboard',
    });

    // Look for the best location to insert the Gist buttons.
    let index: number = utils.getButtonIndex(panel.toolbar);
    panel.toolbar.insertItem(index, 'postGist', postButton);
    panel.toolbar.insertItem(index + 1, 'copyURLGist', copyURLButton);
    panel.toolbar.insertItem(index + 2, 'deleteGist', deleteButton);

    if (gist_info['gist_id'] == null) {
      deleteButton.setHidden(true);
      copyURLButton.setHidden(true);
    }

    return new DisposableDelegate(() => {
      postButton.dispose();
      deleteButton.dispose();
      copyURLButton.dispose();
    });
  }
}

/**
 * Activate the extension.
 */
function activate(app: JupyterLab, settingRegistry: ISettingRegistry) {
  const extension = new GistButtonExtension();
  extension.settingRegistry = settingRegistry;
  app.docRegistry.addWidgetExtension('Notebook', extension);
}

/**
 * Export the plugin as default.
 */
export default plugin;
