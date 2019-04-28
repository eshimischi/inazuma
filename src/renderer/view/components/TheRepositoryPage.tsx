import { VNode } from "vue";
import BaseLayout from "./BaseLayout";
import TabLog from "./RepositoryPageTabLog";
import TabFile from "./RepositoryPageTabFile";
import TabTree from "./RepositoryPageTabTree";
import SideBarBranches from "./SideBarBranches";
import SideBarRemotes from "./SideBarRemotes";
import VIconButton from "./base/VIconButton";
import VTabs from "./base/VTabs";
import DrawerNavigation from "./DrawerNavigation";
import { __sync } from "../utils/modifiers";
import { RepositoryTabDefinition } from "../mainTypes";
import { rootModule, withStore } from "view/store";
import { tabsModule } from "view/store/tabsModule";

// @vue/component
export default withStore.create({
  computed: {
    ...rootModule.mapGetters(["repoName", "repositoryTabs"]),
    sidebarVNode(): VNode | undefined {
      switch (this.state.sidebar) {
        case "branches":
          return <SideBarBranches />;
        case "remotes":
          return <SideBarRemotes />;
        default:
          return undefined;
      }
    },
    selectedTabIndex: {
      get(): number {
        return this.state.tabs.selectedIndex;
      },
      set(index: number): void {
        this.selectTab({ index });
      }
    }
  },
  methods: {
    ...rootModule.mapActions([
      "runInteractiveShell",
      "showSidebar",
      "showPreference",
      "showWelcomePage",
      "showVersionDialog",
      "removeTab"
    ]),
    ...tabsModule.mapActions({ selectTab: "select" }),
    reload() {
      location.reload();
    },
    closeTab(key: string) {
      this.removeTab({ key });
    },
    renderTab(tab: RepositoryTabDefinition): VNode {
      if (tab.kind === "log") {
        return <TabLog />;
      } else if (tab.kind === "file") {
        const { key, props, lazyProps } = tab;
        return (
          <TabFile
            tabkey={key}
            path={props.relPath}
            sha={props.sha}
            blame={lazyProps && lazyProps.blame}
          />
        );
      } else if (tab.kind === "tree") {
        const { key, props, lazyProps } = tab;
        return (
          <TabTree
            tabkey={key}
            sha={props.sha}
            rootNodes={lazyProps && lazyProps.rootNodes}
          />
        );
      } else {
        console.error("unknown tab kind", tab);
        return <div />;
      }
    }
  },
  render(): VNode {
    return (
      <BaseLayout title={this.repoName}>
        <template slot="titlebar-buttons">
          <VIconButton
            mini
            disabled={!this.state.config.interactiveShell}
            tooltip="launch interactive shell"
            action={this.runInteractiveShell}
          >
            input
          </VIconButton>
          <VIconButton mini tooltip="reload" action={this.reload}>
            refresh
          </VIconButton>
        </template>
        <template slot="drawer-navigations">
          <DrawerNavigation
            icon="local_offer"
            text="Branches"
            action={() => this.showSidebar({ name: "branches" })}
          />
          <DrawerNavigation
            icon="cloud"
            text="Remotes"
            action={() => this.showSidebar({ name: "remotes" })}
          />
          <DrawerNavigation
            icon="settings"
            text="Preferences"
            action={this.showPreference}
          />
          <DrawerNavigation
            icon="home"
            text="Go to Home"
            action={this.showWelcomePage}
          />
          <DrawerNavigation
            icon="info_outline"
            text="About"
            action={this.showVersionDialog}
          />
        </template>
        <keep-alive>{this.sidebarVNode}</keep-alive>
        <VTabs
          tabs={this.repositoryTabs}
          selectedIndex={__sync(this.selectedTabIndex)}
          closeTab={this.closeTab}
          scopedSlots={{
            default: ({ tab }) => [
              this.renderTab(tab as RepositoryTabDefinition)
            ]
          }}
        />
      </BaseLayout>
    );
  }
});
