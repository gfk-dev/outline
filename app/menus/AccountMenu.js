// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { MoonIcon } from 'outline-icons';
import styled, { withTheme } from 'styled-components';
import UiStore from 'stores/UiStore';
import AuthStore from 'stores/AuthStore';
import Flex from 'shared/components/Flex';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';
import Modal from 'components/Modal';
import KeyboardShortcuts from 'scenes/KeyboardShortcuts';
import {
  developers,
  changelog,
  githubIssuesUrl,
  mailToUrl,
  spectrumUrl,
  settings,
} from '../../shared/utils/routeHelpers';

type Props = {
  label: React.Node,
  ui: UiStore,
  auth: AuthStore,
  theme: Object,
};

@observer
class AccountMenu extends React.Component<Props> {
  @observable keyboardShortcutsOpen: boolean = false;

  handleLogout = () => {
    this.props.auth.logout();
  };

  handleOpenKeyboardShortcuts = () => {
    this.keyboardShortcutsOpen = true;
  };

  handleCloseKeyboardShortcuts = () => {
    this.keyboardShortcutsOpen = false;
  };

  render() {
    const { ui, theme, auth } = this.props;
    const isLightTheme = ui.theme === 'light';
    const { user = {} } = auth;
    const isAdmin = user.isAdmin;

    return (
      <React.Fragment>
        <Modal
          isOpen={this.keyboardShortcutsOpen}
          onRequestClose={this.handleCloseKeyboardShortcuts}
          title="Keyboard shortcuts"
        >
          <KeyboardShortcuts />
        </Modal>
        <DropdownMenu
          style={{ marginRight: 10, marginTop: -10 }}
          label={this.props.label}
        >
          {isAdmin && (
            <DropdownMenuItem as={Link} to={settings()}>
              Settings
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={this.handleOpenKeyboardShortcuts}>
              Keyboard shortcuts
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem href={developers()} target="_blank">
              API documentation
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem href={changelog()} target="_blank">
              Changelog
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem href={spectrumUrl()} target="_blank">
              Community
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem href={mailToUrl()} target="_blank">
              Send us feedback
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem href={githubIssuesUrl()} target="_blank">
              Report a bug
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={ui.toggleDarkMode}>
            <NightMode justify="space-between">
              Night Mode{' '}
              <MoonIcon
                color={isLightTheme ? theme.textSecondary : theme.primary}
              />
            </NightMode>
          </DropdownMenuItem>
          <hr />
          <DropdownMenuItem onClick={this.handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenu>
      </React.Fragment>
    );
  }
}

const NightMode = styled(Flex)`
  width: 100%;
`;

export default inject('ui', 'auth')(withTheme(AccountMenu));
