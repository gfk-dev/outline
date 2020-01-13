// @flow
import * as React from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { PlusIcon, CollectionIcon, PrivateCollectionIcon } from 'outline-icons';

import { newDocumentUrl } from 'utils/routeHelpers';
import CollectionsStore from 'stores/CollectionsStore';
import PoliciesStore from 'stores/PoliciesStore';
import AuthStore from 'stores/AuthStore';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';
import Button from 'components/Button';

type Props = {
  label?: React.Node,
  collections: CollectionsStore,
  policies: PoliciesStore,
  auth: AuthStore,
};

@observer
class NewDocumentMenu extends React.Component<Props> {
  @observable redirectTo: ?string;

  componentDidUpdate() {
    this.redirectTo = undefined;
  }

  handleNewDocument = (collectionId: string) => {
    this.redirectTo = newDocumentUrl(collectionId);
  };

  onOpen = () => {
    const { collections } = this.props;

    if (collections.orderedData.length === 1) {
      this.handleNewDocument(collections.orderedData[0].id);
    }
  };

  render() {
    if (this.redirectTo) return <Redirect to={this.redirectTo} push />;

    const { collections, policies, label, auth, ...rest } = this.props;
    const { user = {} } = auth;

    return (
      <div>
        {user.isAdmin ? (
          <DropdownMenu
            label={
              label || (
                <Button icon={<PlusIcon />} small>
                  New doc
                </Button>
              )
            }
            onOpen={this.onOpen}
            {...rest}
          >
            <DropdownMenuItem disabled>Choose a collection…</DropdownMenuItem>
            {collections.orderedData.map(collection => {
              const can = policies.abilities(collection.id);

              return (
                <DropdownMenuItem
                  key={collection.id}
                  onClick={() => this.handleNewDocument(collection.id)}
                  disabled={!can.update}
                >
                  {collection.private ? (
                    <PrivateCollectionIcon color={collection.color} />
                  ) : (
                    <CollectionIcon color={collection.color} />
                  )}{' '}
                  {collection.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenu>
        ) : (
          <span />
        )}
      </div>
    );
  }
}

export default inject('collections', 'policies', 'auth')(NewDocumentMenu);
