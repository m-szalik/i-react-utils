import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import {Breadcrumbs, bc} from '../src/Breadcrumbs';


describe("Breadcrumbs", function() {
  this.timeout(30000);

    const componentDefinition = (<Breadcrumbs className="mainBC" renderHome={true}>
        <h1>Header</h1>
        <Breadcrumbs config={ [ bc("/pag0", "Zero"), bc("/pag1", "One") ]} />
    </Breadcrumbs>);
    const component = TestUtils.renderIntoDocument(componentDefinition);
    const domElements = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div')[0].children;

    it("Render - breadcrumbs on top", () => {
        assert(domElements[0].id == 'breadcrumb', "First element should be breadcrumbs container but is " + domElements[0]);
        assert(domElements[1].tagName == 'H1', "2nd element should H1 " + domElements[1].tagName + ' ==> (' + domElements[1] + ')');
    });

    it("Render - breadcrumbs has home node", () => {
        const breadcrumbItems = domElements[0].children[0].children;
        assert(breadcrumbItems.length == 3, "Wrong number of nodes ==> " + breadcrumbItems);
        assert(breadcrumbItems[0].children[0].className == 'home', "No home node");
    });

    it("Render - last node has active class", () => {
        const breadcrumbItems = domElements[0].children[0].children;
        const last = breadcrumbItems[breadcrumbItems.length -1];
        assert(last.className == 'active', "Hast node has no active class ==> " + last);
    });
});
