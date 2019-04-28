import { VNode } from "vue";
import Electron from "electron";
import * as tsx from "vue-tsx-support";
import p from "vue-strict-prop";
import BaseLayout from "./BaseLayout";
import DrawerNavigation from "./DrawerNavigation";
import { getFileName, normalizePathSeparator } from "core/utils";
import * as md from "view/utils/md-classes";
import {
  MdIcon,
  MdDoubleLineList,
  MdSubheader,
  MdDivider,
  MdListItem,
  MdListItemText
} from "./base/md";
import * as emotion from "emotion";
import VIconButton from "./base/VIconButton";
import { rootModule } from "view/store";
const { dialog, BrowserWindow } = Electron.remote;
const css = emotion.css;

const RepositoryListItem = tsx.component({
  name: "RepositoryListItem",
  functional: true,
  props: {
    icon: p(String).required,
    text: p(String).required,
    description: p(String).required,
    action: p.ofFunction<() => void>().required,
    remove: p.ofFunction<() => void>().optional
  },
  render(_h, ctx): VNode {
    const { props, data } = ctx;
    return (
      <MdListItem onClick={props.action} {...data}>
        <MdIcon>{props.icon}</MdIcon>
        <MdListItemText>
          <span class={[md.SUBHEADING, style.repoName]}>{props.text}</span>
          <span class={[md.CAPTION, style.repoDescription]}>
            {props.description}
          </span>
        </MdListItemText>
        {props.remove ? (
          <VIconButton staticClass="md-list-action" mini action={props.remove}>
            close
          </VIconButton>
        ) : (
          undefined
        )}
      </MdListItem>
    );
  }
});

// @vue/component
export default tsx.component({
  name: "TheWelcomePage",
  components: {
    BaseLayout,
    DrawerNavigation
  },
  computed: {
    ...rootModule.mapGetters(["visibleRecentList"]),
    recentOpened(): string[] {
      return this.visibleRecentList;
    }
  },
  methods: {
    ...rootModule.mapActions([
      "openRepository",
      "removeRecentList",
      "showPreference",
      "showVersionDialog"
    ]),
    selectRepository(): void {
      const parent = BrowserWindow.getFocusedWindow();
      const options: Electron.OpenDialogOptions = {
        properties: ["openDirectory"]
      };
      const paths = parent
        ? dialog.showOpenDialog(parent, options)
        : dialog.showOpenDialog(options);
      if (typeof paths === "undefined") {
        return;
      }
      const repoPath = normalizePathSeparator(paths[0]);
      this.openRepository({ repoPath });
    }
  },
  render(): VNode {
    return (
      <BaseLayout title="inazuma">
        <template slot="drawer-navigations">
          <DrawerNavigation
            icon="settings"
            text="Preferences"
            action={this.showPreference}
          />
          <DrawerNavigation
            icon="info_outline"
            text="About"
            action={this.showVersionDialog}
          />
        </template>
        <div class={style.content}>
          <h3 class={md.TITLE}>SELECT REPOSITORY</h3>
          <div class={style.leftPanel}>
            <MdDoubleLineList>
              <RepositoryListItem
                key=":browser"
                icon="search"
                text="BROWSE..."
                description="Select repositories by folder browser"
                action={this.selectRepository}
              />
              <MdDivider class={style.divider} />
              <MdSubheader class={[md.PRIMARY, md.CAPTION]}>
                Recent opened
              </MdSubheader>
              <transition-group name="recents">
                {this.recentOpened.map(repoPath => (
                  <RepositoryListItem
                    key={repoPath}
                    icon="history"
                    text={getFileName(repoPath)}
                    description={repoPath}
                    action={() => this.openRepository({ repoPath })}
                    remove={() => this.removeRecentList({ repoPath })}
                  />
                ))}
              </transition-group>
            </MdDoubleLineList>
          </div>
        </div>
      </BaseLayout>
    );
  }
});

const style = {
  content: css`
    flex: 1;
    padding: 0 1em;
  `,
  leftPanel: css`
    display: inline-block;
    min-width: 40%;

    .md-list {
      background-color: var(--md-theme-default-background-on-background);
      padding: 0 0.5em;

      .recents-move {
        transition: transform 0.3s;
      }
      .recents-leave-active {
        position: absolute;
      }
    }
    .md-list-item-content {
      min-height: 32px !important;
      :hover .md-list-action {
        opacity: 1;
      }
    }
    .md-subheader {
      min-height: 32px !important;
    }
    .md-icon {
      margin-right: 0 !important;
    }
    .md-list-action {
      opacity: 0;
    }
  `,
  repoName: css`
    height: 20px;
    margin-left: 16px;
    margin-right: auto;
    text-transform: none !important;
  `,
  repoDescription: css`
    margin-left: 16px;
    text-transform: none !important;
    font-size: 75%;
  `,
  divider: css`
    margin: 0.5em 0 !important;
  `
};
