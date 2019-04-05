// https://github.com/DevExpress/testcafe
// https://devexpress.github.io/testcafe/documentation/test-api/
// https://github.com/helen-dikareva/axe-testcafe
import {Selector} from 'testcafe';

fixture`TestCafe UI tests`
    .page`http://localhost:8041/demo/`;

test('Demo: Add red rectangle', async (t) => {
    await t
        .click('a[data-color="red"]')
        .click('#rect')
        .expect(
            Selector('div._imageMaps_area > map > svg > g > rect._shape_face')
                .getAttribute('style')
        ).match(/stroke:\s*red/u, 'Red stroke');
});
