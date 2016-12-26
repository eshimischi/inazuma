import * as VueRouter from "vue-router";
import * as typed from "vue-typed-component";
const p = typed.PropOptions;

interface LeftPanelBaseProps {
    title: string;
}

@typed.component<LeftPanelBaseProps>({
    ...<CompiledTemplate>require("./base.pug"),
    props: {
        title: p.Str
    }
})
export class LeftPanelBase extends typed.TypedComponent<LeftPanelBaseProps> {
    $router: VueRouter;
    $route: VueRouter.Route;

    navigateToLog() {
        this.$router.replace({ name: "log", params: this.$route.params });
    }
}
