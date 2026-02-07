import { chromium } from "playwright";

const ROOM_ID = `test-${Date.now()}`;
const URL = `https://fugaapp.site/theomachia?room=${ROOM_ID}`;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  console.log("🎮 テオマキア対戦テスト開始");
  console.log(`📍 ルームID: ${ROOM_ID}`);
  console.log(`🔗 URL: ${URL}`);
  
  const browser = await chromium.launch({ headless: true });
  
  // プレイヤー1
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  
  // プレイヤー2
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  
  try {
    // 両プレイヤーが入室
    console.log("\n📥 プレイヤー1 入室...");
    await page1.goto(URL);
    await page1.waitForSelector('input[placeholder*="名前"]', { timeout: 10000 });
    await page1.fill('input[placeholder*="名前"]', 'プレイヤー1');
    await page1.click('button:has-text("入室")');
    await sleep(1000);
    
    console.log("📥 プレイヤー2 入室...");
    await page2.goto(URL);
    await page2.waitForSelector('input[placeholder*="名前"]', { timeout: 10000 });
    await page2.fill('input[placeholder*="名前"]', 'プレイヤー2');
    await page2.click('button:has-text("入室")');
    await sleep(1000);
    
    // 準備完了ボタン
    console.log("\n✅ プレイヤー1 準備完了...");
    await page1.waitForSelector('button:has-text("準備完了")', { timeout: 5000 });
    await page1.click('button:has-text("準備完了")');
    await sleep(500);
    
    console.log("✅ プレイヤー2 準備完了...");
    await page2.waitForSelector('button:has-text("準備完了")', { timeout: 5000 });
    await page2.click('button:has-text("準備完了")');
    await sleep(2000);
    
    // ゲーム開始確認
    console.log("\n🎯 ゲーム開始を確認...");
    
    // ターン表示があるか確認
    const turnIndicator1 = await page1.$('text=/ターン/');
    const turnIndicator2 = await page2.$('text=/ターン/');
    
    if (turnIndicator1 || turnIndicator2) {
      console.log("✅ ゲーム画面が表示されました！");
    } else {
      console.log("❌ ゲーム画面が表示されていません");
    }
    
    // スクリーンショット
    await page1.screenshot({ path: '/tmp/theomachia-p1.png', fullPage: true });
    await page2.screenshot({ path: '/tmp/theomachia-p2.png', fullPage: true });
    console.log("\n📸 スクリーンショット保存:");
    console.log("   /tmp/theomachia-p1.png (プレイヤー1)");
    console.log("   /tmp/theomachia-p2.png (プレイヤー2)");
    
    // 手札確認
    const p1Cards = await page1.$$('[style*="border"][style*="solid"]');
    const p2Cards = await page2.$$('[style*="border"][style*="solid"]');
    console.log(`\n🃏 プレイヤー1の手札: ${p1Cards.length}枚`);
    console.log(`🃏 プレイヤー2の手札: ${p2Cards.length}枚`);
    
    // ターンを確認
    const isP1Turn = await page1.$('text="あなたのターン"');
    const isP2Turn = await page2.$('text="あなたのターン"');
    
    if (isP1Turn) {
      console.log("\n🎮 現在: プレイヤー1のターン");
      
      // カードをプレイしてみる
      console.log("📤 カードをプレイ...");
      const firstCard = await page1.$('[style*="border"][style*="solid"]');
      if (firstCard) {
        await firstCard.click();
        await sleep(500);
        
        // 使うボタンがあれば押す
        const playButton = await page1.$('button:has-text("使う")');
        if (playButton) {
          await playButton.click();
          await sleep(1000);
        }
      }
    } else if (isP2Turn) {
      console.log("\n🎮 現在: プレイヤー2のターン");
    }
    
    // 最終スクリーンショット
    await sleep(1000);
    await page1.screenshot({ path: '/tmp/theomachia-p1-after.png', fullPage: true });
    await page2.screenshot({ path: '/tmp/theomachia-p2-after.png', fullPage: true });
    console.log("\n📸 アクション後スクリーンショット保存:");
    console.log("   /tmp/theomachia-p1-after.png");
    console.log("   /tmp/theomachia-p2-after.png");
    
    console.log("\n✅ テスト完了！");
    
  } catch (error) {
    console.error("❌ エラー:", error.message);
    await page1.screenshot({ path: '/tmp/theomachia-error-p1.png' });
    await page2.screenshot({ path: '/tmp/theomachia-error-p2.png' });
    console.log("📸 エラー時スクリーンショット保存");
  } finally {
    await browser.close();
  }
}

runTest();
