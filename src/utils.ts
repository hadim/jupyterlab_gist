import { Toolbar } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';
import { toArray } from '@phosphor/algorithm';

/**
 * Try to get the best location for the Gist button.
 * Before the spacer.
 */
export function getButtonIndex(toolbar: Toolbar<Widget>) {
  // This is the default index.
  let index: number = 9;

  let childArray = toArray(toolbar.children());

  for (let child of childArray) {
    if (child.constructor.name === 'Spacer') {
      return childArray.indexOf(child);
    }
  }
  return index;
}
