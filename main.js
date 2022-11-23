'use strict';

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://pptr.dev/#resources');
  let start = 11000;
  let end = 11500;

  while (start < end) {
    // Type into search box.
    await page.$eval('#MainContent_txtRegNo', e => e.removeAttribute("disabled"))
    await page.$eval('#MainContent_Button_GetRecord', e => e.removeAttribute("disabled"))
    await page.$eval('#MainContent_txtRegNo', e => e.value = '')
    await page.type('#MainContent_txtRegNo', start.toString());

    // Wait for suggest overlay to appear and click "show all results".
    const allResultsSelector = '#MainContent_Button_GetRecord';
    await page.waitForSelector(allResultsSelector);
    await page.click(allResultsSelector);

    // Wait for the results page to load and display the results.
    const resultsSelector = '#MainContent_txtStudentName';
    await page.waitForSelector(resultsSelector);
    let filename = `${start}-example.png`
    // await page.screenshot({ path:filename });

    // Extract the results from the page.
    const inner_html = await page.$eval('#MainContent_txtStudentName', element => element.value);
    let classname = await page.$eval('#MainContent_txtClass', element => element.value);
    classname = classname ? classname : '---- - -'
    if (classname.includes('XII')) {
      console.log(`$ID: ${start}, class: ${classname}, Student name: ${inner_html}`);
    } else {
      console.log(`$ID: ${start}, ------------------------------------------------`)
    }
    start++;
  }

  await browser.close();
})();