import { test, expect } from "@playwright/test";

test("home is responsive and cycles themes without horizontal overflow", async ({page})=>{
  await page.goto("/",{waitUntil:"domcontentloaded"});
  await expect(page.getByText("WARM MEDIA").first()).toBeVisible();
  for(const width of [320,360,375,390,414,430,768,1024,1366,1920]){
    await page.setViewportSize({width,height:width<500?800:900});
    await page.waitForTimeout(80);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
    expect(overflow,`horizontal overflow at ${width}px`).toBeFalsy();
  }
  await page.setViewportSize({width:390,height:800});
  const themeButton=page.getByRole("button",{name:/تغيير المظهر/});
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","light");
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","red");
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
});

test("core routes render and HAZEM typography controls are visible", async ({page})=>{
  for(const route of ["/","/news","/community","/login","/signup","/support","/hazem","/hazem/typography"]){
    const response=await page.goto(route,{waitUntil:"domcontentloaded"});
    expect(response?.status(),route).toBeLessThan(500);
  }
  await page.goto("/hazem/typography");
  await expect(page.getByText("إدارة الخطوط والألوان")).toBeVisible();
  await expect(page.getByLabel("الخط")).toBeVisible();
  await expect(page.getByRole("button",{name:"حفظ"})).toBeVisible();
});

test("mobile drawer opens and closes", async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto("/",{waitUntil:"load"});
  await page.waitForTimeout(500);
  await page.getByRole("button",{name:"القائمة"}).click();
  await expect(page.getByLabel("القائمة الرئيسية")).toBeVisible();
  await page.getByRole("button",{name:"إغلاق القائمة"}).click();
  await expect(page.getByLabel("القائمة الرئيسية")).not.toBeVisible();
});
