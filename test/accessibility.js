// https://github.com/DevExpress/testcafe
// https://devexpress.github.io/testcafe/documentation/test-api/
// https://github.com/helen-dikareva/axe-testcafe
import {checkForViolations} from '@testcafe-community/axe';

fixture`TestCafe Axe accessibility tests (Demo)`
    .page`http://localhost:8041/demo/`;

test('Demo: General accessibility', async (t) => {
    await checkForViolations(t); // , axeContent, axeOptions: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axerun
});
