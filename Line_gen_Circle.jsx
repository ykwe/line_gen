/*
    Line Generator [Circle] Ver 2.6
    
    Created by ykwe with Gemini for Adobe Illustrator
    This is a personally developed alpha version.
    We apologize for any bugs or issues that may occur.
    We cannot be held responsible for any problems.

*/

(function() {

    // --- グローバル変数・シード ---
    var seedArray = []; // Mode 1用 (動的生成)
    var noiseSeed = Math.random() * 100; // Mode 3用

    // --- メイン処理 ---
    function main() {
        if (app.documents.length === 0) {
            alert("ドキュメントを開いてから実行してください。");
            return;
        }

        var dialog = new Window("dialog", "円 v2.6");
        dialog.orientation = "column";
        dialog.alignChildren = ["fill", "top"];
        dialog.spacing = 10;
        dialog.margins = 16;

        // ===============================================
        // 1. 基本設定パネル
        // ===============================================
        var pnlBasic = dialog.add("panel", undefined, "基本設定");
        pnlBasic.alignChildren = ["left", "top"];
        pnlBasic.orientation = "column";
        pnlBasic.spacing = 5;

        // --- 行1: 半径 と 周回数 ---
        var row1 = pnlBasic.add("group");
        row1.orientation = "row";
        row1.alignChildren = ["left", "center"];
        row1.spacing = 10;

        // 半径
        var grpRad = row1.add("group");
        grpRad.add("statictext", undefined, "半径:");
        var inpRad = grpRad.add("edittext", undefined, "100");
        inpRad.characters = 5;
        grpRad.add("statictext", undefined, "pt");

        // 周回数
        var grpLoops = row1.add("group");
        grpLoops.add("statictext", undefined, "周回数:");
        var inpLoops = grpLoops.add("edittext", undefined, "30");
        inpLoops.characters = 4;

        // --- 改行（スペーサー） ---
        var spacer = pnlBasic.add("group");
        spacer.preferredSize.height = 2; 

        // --- 行2: 線幅 ---
        var row2 = pnlBasic.add("group");
        row2.orientation = "row";
        row2.alignChildren = ["left", "center"];
        
        row2.add("statictext", undefined, "線幅:");
        var inpStroke = row2.add("edittext", undefined, "0.5");
        inpStroke.characters = 5;
        row2.add("statictext", undefined, "pt");

        // ===============================================
        // 2. 描画モードパネル
        // ===============================================
        var pnlMode = dialog.add("panel", undefined, "描画モード");
        pnlMode.alignChildren = ["fill", "top"];
        pnlMode.orientation = "column";

        // --- ラジオボタンエリア ---
        var grpRadios = pnlMode.add("group");
        grpRadios.orientation = "column";
        grpRadios.alignChildren = ["left", "center"];
        grpRadios.spacing = 5;

        var rb1 = grpRadios.add("radiobutton", undefined, "モード1 / フリーハンド型");
        var rb2 = grpRadios.add("radiobutton", undefined, "モード2 / リサージュ型");
        var rb3 = grpRadios.add("radiobutton", undefined, "モード3 / ラーメン型");
        rb1.value = true; // デフォルト

        // --- 区切り線 ---
        var div = pnlMode.add("panel");
        div.alignment = "fill";
        div.preferredSize.height = 2;

        // --- 設定項目スタックエリア ---
        var grpStack = pnlMode.add("group");
        grpStack.orientation = "stack";
        grpStack.alignChildren = ["fill", "top"];
        grpStack.margins = [0, 5, 0, 0];

        // ------------------------------------------------
        // 【A: モード1 / フリーハンド型 設定】
        // ------------------------------------------------
        var grpA = grpStack.add("group");
        grpA.orientation = "column";
        grpA.alignChildren = ["left", "center"];
        grpA.visible = true;

        // 1. 中心の移動範囲
        var rowDriftA = grpA.add("group");
        rowDriftA.alignChildren = ["left", "center"];
        rowDriftA.add("statictext", undefined, "中心の移動範囲:");
        var inpDriftA = rowDriftA.add("edittext", undefined, "30.0");
        inpDriftA.characters = 5;
        rowDriftA.add("statictext", undefined, "pt");

        // 2. サイズの変化量
        var rowVarA = grpA.add("group");
        rowVarA.alignChildren = ["left", "center"];
        rowVarA.add("statictext", undefined, "サイズの変化量:");
        var inpVarA = rowVarA.add("edittext", undefined, "20.0");
        inpVarA.characters = 5;
        rowVarA.add("statictext", undefined, "%");

        // 3. 正円率
        var rowStabA = grpA.add("group");
        rowStabA.alignChildren = ["left", "center"];
        rowStabA.add("statictext", undefined, "正円率:");
        var inpStabA = rowStabA.add("edittext", undefined, "5.0");
        inpStabA.characters = 5;

        // 4. アンカーポイント数
        var rowResA = grpA.add("group");
        rowResA.alignChildren = ["left", "center"];
        rowResA.add("statictext", undefined, "アンカーポイント数:");
        var inpResA = rowResA.add("edittext", undefined, "12"); // デフォルト12に変更
        inpResA.characters = 5;
        rowResA.add("statictext", undefined, "pt/周");


        // ------------------------------------------------
        // 【B: モード2 / リサージュ型 設定】
        // ------------------------------------------------
        var grpB = grpStack.add("group");
        grpB.orientation = "column";
        grpB.alignChildren = ["left", "center"];
        grpB.visible = false;

        // 中心の移動範囲
        var rowDriftB = grpB.add("group");
        rowDriftB.alignChildren = ["left", "center"];
        rowDriftB.add("statictext", undefined, "中心の移動範囲:");
        var inpDriftB = rowDriftB.add("edittext", undefined, "30.0");
        inpDriftB.characters = 5;
        rowDriftB.add("statictext", undefined, "pt");

        // XY周期のずれ
        var rowDetuneB = grpB.add("group");
        rowDetuneB.alignChildren = ["left", "center"];
        rowDetuneB.add("statictext", undefined, "XY周期のずれ:");
        var inpDetuneB = rowDetuneB.add("edittext", undefined, "1.5");
        inpDetuneB.characters = 5;
        rowDetuneB.add("statictext", undefined, "%");

        // 振幅のうねり
        var rowAmpB = grpB.add("group");
        rowAmpB.alignChildren = ["left", "center"];
        rowAmpB.add("statictext", undefined, "振幅のうねり:");
        var inpAmpB = rowAmpB.add("edittext", undefined, "10.0");
        inpAmpB.characters = 5;
        rowAmpB.add("statictext", undefined, "%");

        // アンカーポイント数
        var rowResB = grpB.add("group");
        rowResB.alignChildren = ["left", "center"];
        rowResB.add("statictext", undefined, "アンカーポイント数:");
        var inpResB = rowResB.add("edittext", undefined, "12"); // デフォルト12
        inpResB.characters = 5;
        rowResB.add("statictext", undefined, "pt/周");

        // チェックボックス
        var chkNoiseB = grpB.add("checkbox", undefined, "リズムを不規則にする");
        chkNoiseB.value = true;

        // ------------------------------------------------
        // 【C: モード3 / ラーメン型 設定】
        // ------------------------------------------------
        var grpC = grpStack.add("group");
        grpC.orientation = "column";
        grpC.alignChildren = ["left", "center"];
        grpC.visible = false;

        // 1. 中心の移動範囲
        var rowDriftC = grpC.add("group");
        rowDriftC.alignChildren = ["left", "center"];
        rowDriftC.add("statictext", undefined, "中心の移動範囲:");
        var inpDriftC = rowDriftC.add("edittext", undefined, "30.0"); 
        inpDriftC.characters = 5;
        rowDriftC.add("statictext", undefined, "pt");

        // 2. ゆらぎの強さ
        var rowStrC = grpC.add("group");
        rowStrC.alignChildren = ["left", "center"];
        rowStrC.add("statictext", undefined, "ゆらぎの強さ:");
        var inpStrC = rowStrC.add("edittext", undefined, "20.0");
        inpStrC.characters = 5;
        rowStrC.add("statictext", undefined, "%");

        // 3. ゆらぎの速さ
        var rowFreqC = grpC.add("group");
        rowFreqC.alignChildren = ["left", "center"];
        rowFreqC.add("statictext", undefined, "ゆらぎの速さ:");
        var inpFreqC = rowFreqC.add("edittext", undefined, "0.3");
        inpFreqC.characters = 5;

        // 4. アンカーポイント数
        var rowResC = grpC.add("group");
        rowResC.alignChildren = ["left", "center"];
        rowResC.add("statictext", undefined, "アンカーポイント数:");
        var inpResC = rowResC.add("edittext", undefined, "32"); // デフォルト32
        inpResC.characters = 5;
        rowResC.add("statictext", undefined, "pt/周");

        // --- イベント処理: パネル切り替え ---
        rb1.onClick = function() { grpA.visible = true; grpB.visible = false; grpC.visible = false; }
        rb2.onClick = function() { grpA.visible = false; grpB.visible = true; grpC.visible = false; }
        rb3.onClick = function() { grpA.visible = false; grpB.visible = false; grpC.visible = true; }

        // ===============================================
        // フッター
        // ===============================================
        var chkLog = dialog.add("checkbox", undefined, "設定値をテキストとして出力する");
        chkLog.value = true;

        var grpBtns = dialog.add("group");
        grpBtns.alignment = "center"; 
        grpBtns.add("button", undefined, "キャンセル", {name: "cancel"});
        var btnOk = grpBtns.add("button", undefined, "生成する", {name: "ok"});

        if (dialog.show() === 1) {
            var selectedMode = "A";
            if (rb2.value) selectedMode = "B";
            if (rb3.value) selectedMode = "C";

            var params = {
                mode: selectedMode,
                radius: parseFloat(inpRad.text),
                loops: parseFloat(inpLoops.text),
                stroke: parseFloat(inpStroke.text),
                log: chkLog.value
            };

            if (isNaN(params.loops) || params.loops < 1) params.loops = 1;

            if (params.mode === "A") {
                params.driftRange = parseFloat(inpDriftA.text);
                params.sizeVar = parseFloat(inpVarA.text);
                params.stability = parseFloat(inpStabA.text);
                params.resolution = parseInt(inpResA.text); // Mode 1 Resolution
            } else if (params.mode === "B") {
                params.driftAmt = parseFloat(inpDriftB.text);
                params.detune = parseFloat(inpDetuneB.text);
                params.ampFlow = parseFloat(inpAmpB.text);
                params.resolution = parseInt(inpResB.text); // Mode 2 Resolution
                params.useNoise = chkNoiseB.value;
            } else { // C
                params.driftAmt = parseFloat(inpDriftC.text);
                params.noiseStrength = parseFloat(inpStrC.text);
                params.noiseSpeed = parseFloat(inpFreqC.text);
                params.resolution = parseInt(inpResC.text); // Mode 3 Resolution
            }
            
            // 安全策: 最小値チェック
            if (isNaN(params.resolution) || params.resolution < 4) params.resolution = 4;

            generateUnifiedCircle(params);
        }
    }

    // --- 計算ロジック A (Mode 1) ---
    function initSeedsA(count) {
        seedArray = [];
        for(var i=0; i<count; i++) seedArray.push(Math.random());
    }
    
    function getSmoothRandomA(t, offsetIndex) {
        var i = Math.floor(t);
        var f = t - i;
        var idx1 = (i + offsetIndex) % seedArray.length;
        var idx2 = (i + 1 + offsetIndex) % seedArray.length;
        var v1 = seedArray[idx1];
        var v2 = seedArray[idx2];
        var smoothT = f * f * (3 - 2 * f); 
        return v1 * (1 - smoothT) + v2 * smoothT; 
    }

    // --- 計算ロジック B (Mode 2) ---
    function organicNoiseB(t, seeds) {
        var n = 0;
        n += Math.sin(t * 1.0 + seeds[0]) * 0.5;
        n += Math.sin(t * 1.7 + seeds[1]) * 0.3;
        n += Math.sin(t * 2.9 + seeds[2]) * 0.2;
        return n; 
    }

    // --- 計算ロジック C (Mode 3) ---
    function smoothNoiseC(x) {
        var i = Math.floor(x);
        var f = x - i;
        var v1 = Math.sin(i * 12.9898 + noiseSeed) * 43758.5453;
        v1 = v1 - Math.floor(v1);
        var v2 = Math.sin((i + 1) * 12.9898 + noiseSeed) * 43758.5453;
        v2 = v2 - Math.floor(v2);
        var ft = f * Math.PI;
        var blend = (1 - Math.cos(ft)) * 0.5;
        return v1 * (1 - blend) + v2 * blend;
    }

    // --- 統合生成関数 ---
    function generateUnifiedCircle(p) {
        var pointsBuffer = [];
        var modelName = "";
        
        var pathTension = 0.33; 
        var handleMult = 0.17; 

        if (p.mode === "A") {
            modelName = "モード1"; 
            
            var pointsPerLoop = p.resolution; // ユーザー設定値を使用
            var totalPoints = Math.ceil(p.loops * pointsPerLoop);
            
            // ノイズ空間を進む速度
            var noiseSpeed = 1.0 / (pointsPerLoop * p.stability); 
            
            var maxTimeIndex = Math.ceil(totalPoints * noiseSpeed);
            var requiredSeeds = maxTimeIndex + 150; 
            initSeedsA(requiredSeeds);

            for (var i = 0; i <= totalPoints; i++) {
                var theta = (i / pointsPerLoop) * Math.PI * 2;
                var time = i * noiseSpeed;

                var driftX = (getSmoothRandomA(time, 0) * 2 - 1) * p.driftRange;
                var driftY = (getSmoothRandomA(time, 50) * 2 - 1) * p.driftRange;

                var varFactor = p.sizeVar / 100.0;
                var radScaleX = 1.0 + (getSmoothRandomA(time, 25) * 2 - 1) * varFactor;
                var radScaleY = 1.0 + (getSmoothRandomA(time, 75) * 2 - 1) * varFactor;

                var x = driftX + (p.radius * radScaleX) * Math.cos(theta);
                var y = driftY + (p.radius * radScaleY) * Math.sin(theta);
                pointsBuffer.push([x, y]);
            }

        } else if (p.mode === "B") {
            modelName = "モード2";
            
            var pointsPerLoop = p.resolution; 
            var totalPoints = Math.ceil(p.loops * pointsPerLoop);
            
            var freqX = 1.0;
            var freqY = 1.0 + (p.detune / 100.0);
            var ampStrength = p.ampFlow / 100.0;
            
            var phaseX = Math.random() * Math.PI * 2;
            var phaseY = Math.random() * Math.PI * 2;
            var flowSeeds = [Math.random()*10, Math.random()*10, Math.random()*10];
            var driftXSeeds = [Math.random()*10, Math.random()*10, Math.random()*10];
            var driftYSeeds = [Math.random()*10, Math.random()*10, Math.random()*10];
            
            var simpleFlowFreq = 3.0; 
            var simpleDriftFreqX = 1.4;
            var simpleDriftFreqY = 2.0;

            for (var i = 0; i <= totalPoints; i++) {
                var normalizedT = i / pointsPerLoop; 
                var theta = normalizedT * Math.PI * 2;
                var time = i / totalPoints * Math.PI * 4; 
                var progress = i / totalPoints;

                var scaleX, scaleY, driftX, driftY;

                if (p.useNoise) {
                    var currentFlowFreq = 3.0 + organicNoiseB(time, flowSeeds) * 1.5;
                    scaleX = 1.0 + Math.sin((theta * currentFlowFreq / p.loops) + flowSeeds[0]) * ampStrength;
                    scaleY = 1.0 + Math.cos((theta * currentFlowFreq * 1.1 / p.loops) + flowSeeds[1]) * ampStrength;
                    driftX = p.driftAmt * organicNoiseB(time * 1.2, driftXSeeds);
                    driftY = p.driftAmt * organicNoiseB(time * 1.5, driftYSeeds);
                } else {
                    scaleX = 1.0 + Math.sin((theta * simpleFlowFreq / p.loops) + flowSeeds[0]) * ampStrength;
                    scaleY = 1.0 + Math.cos((theta * simpleFlowFreq * 1.1 / p.loops) + flowSeeds[1]) * ampStrength;
                    var driftTheta = progress * Math.PI * 2;
                    driftX = p.driftAmt * Math.sin((driftTheta * simpleDriftFreqX) + driftXSeeds[0]);
                    driftY = p.driftAmt * Math.cos((driftTheta * simpleDriftFreqY) + driftYSeeds[0]);
                }

                var orbitX = p.radius * scaleX * Math.cos((theta * freqX) + phaseX);
                var orbitY = p.radius * scaleY * Math.sin((theta * freqY) + phaseY);
                pointsBuffer.push([driftX + orbitX, driftY + orbitY]);
            }

        } else {
            modelName = "モード3";
            
            pathTension = 0.16;
            handleMult = 0.16;

            var pointsPerLoop = p.resolution; // ユーザー設定値を使用
            var totalPoints = Math.ceil(p.loops * pointsPerLoop);
            var strength = p.noiseStrength / 100.0;
            
            noiseSeed = Math.random() * 100;
            var driftSeedX = Math.random() * 100;
            var driftSeedY = Math.random() * 100;
            var angleSeed = Math.random() * 100;

            for (var i = 0; i <= totalPoints; i++) {
                var baseTheta = (i / pointsPerLoop) * Math.PI * 2;
                var progress = i / totalPoints;

                // 角度方向ゆらぎ
                noiseSeed = angleSeed;
                var angleNoise = smoothNoiseC(baseTheta * 0.5); 

                // 半径方向ゆらぎ
                noiseSeed = (angleNoise * 10); 
                var noiseInput = progress * p.noiseSpeed * 10.0; 
                var noiseVal = smoothNoiseC(noiseInput);

                var radiusMod = 1.0 + (noiseVal * 2.0 - 1.0) * strength;
                var currentRadius = p.radius * radiusMod;

                var orbitX = currentRadius * Math.cos(baseTheta);
                var orbitY = currentRadius * Math.sin(baseTheta);

                // ドリフト
                noiseSeed = driftSeedX;
                var driftX = p.driftAmt * (smoothNoiseC(progress * p.noiseSpeed * 5.0) * 2.0 - 1.0);
                noiseSeed = driftSeedY;
                var driftY = p.driftAmt * (smoothNoiseC(progress * p.noiseSpeed * 6.0) * 2.0 - 1.0);
                
                pointsBuffer.push([driftX + orbitX, driftY + orbitY]);
            }
        }

        // --- 共通描画処理 ---
        var doc = app.activeDocument;
        var color = new CMYKColor();
        color.black = 100; color.cyan = 0; color.magenta = 0; color.yellow = 0;

        var pathItem = doc.pathItems.add();
        pathItem.filled = false;
        pathItem.stroked = true;
        pathItem.strokeColor = color;
        pathItem.strokeWidth = p.stroke;
        pathItem.strokeJoin = StrokeJoin.ROUNDENDJOIN;
        pathItem.name = "UnifiedCircle_" + p.mode;

        for (var j = 0; j < pointsBuffer.length; j++) {
            var pt = pathItem.pathPoints.add();
            pt.anchor = pointsBuffer[j];

            if (j === 0) {
                pt.leftDirection = pt.anchor;
                if (pointsBuffer.length > 1) {
                    var next = pointsBuffer[j+1];
                    var tangent = vecSub(next, pointsBuffer[j]);
                    var tStart = (p.mode === "C") ? pathTension * 2 : pathTension;
                    pt.rightDirection = vecAdd(pt.anchor, vecMult(tangent, tStart));
                }
            } 
            else if (j === pointsBuffer.length - 1) {
                pt.rightDirection = pt.anchor;
                var prev = pointsBuffer[j-1];
                var tangent = vecSub(pointsBuffer[j], prev);
                var tEnd = (p.mode === "C") ? pathTension * 2 : pathTension;
                pt.leftDirection = vecSub(pt.anchor, vecMult(tangent, tEnd));
            } 
            else {
                var prev = pointsBuffer[j-1];
                var next = pointsBuffer[j+1];
                var tangent = vecSub(next, prev);
                
                pt.leftDirection = vecSub(pt.anchor, vecMult(tangent, handleMult));
                pt.rightDirection = vecAdd(pt.anchor, vecMult(tangent, handleMult));
            }
        }

        centerObject(doc, pathItem);
        if (p.log) createDetailedLog(doc, pathItem, p, modelName);
    }

    // --- ユーティリティ ---
    function vecAdd(v1, v2) { return [v1[0] + v2[0], v1[1] + v2[1]]; }
    function vecSub(v1, v2) { return [v1[0] - v2[0], v1[1] - v2[1]]; }
    function vecMult(v, s) { return [v[0] * s, v[1] * s]; }

    function centerObject(doc, item) {
        var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
        var abRect = ab.artboardRect;
        var abCenter = [(abRect[0] + abRect[2])/2, (abRect[1] + abRect[3])/2];
        var b = item.geometricBounds;
        var itemCenter = [(b[0] + b[2])/2, (b[1] + b[3])/2];
        item.translate(abCenter[0] - itemCenter[0], abCenter[1] - itemCenter[1]);
    }

    // --- 詳細ログ出力 ---
    function createDetailedLog(doc, target, p, modelName) {
        var txt = doc.textFrames.add();
        var content = "Output Log:\n";
        
        // [円]
        content += "[円] 半径: " + p.radius + " pt / 周回数: " + p.loops + " / 線幅: " + p.stroke + " pt\n";
        
        // [モード]
        var paramsStr = "";
        if (p.mode === "A") {
            paramsStr = "中心移動: " + p.driftRange + " pt / サイズ変化: " + p.sizeVar + "% / 正円率: " + p.stability + " / 周アンカーポイント数: " + p.resolution;
            content += "[モード] 1 (" + paramsStr + ")\n";
        } else if (p.mode === "B") {
            paramsStr = "中心移動: " + p.driftAmt + " pt / XY周期のずれ: " + p.detune + "% / 振幅のうねり: " + p.ampFlow + "% / 周アンカーポイント数: " + p.resolution + " / リズム: " + (p.useNoise ? "不規則" : "規則的");
            content += "[モード] 2 (" + paramsStr + ")\n";
        } else if (p.mode === "C") {
            paramsStr = "中心移動: " + p.driftAmt + " pt / ゆらぎの強さ: " + p.noiseStrength + "% / ゆらぎの速さ: " + p.noiseSpeed + " / 周アンカーポイント数: " + p.resolution;
            content += "[モード] 3 (" + paramsStr + ")\n";
        }

        content += "[モデル] Circle v2.6";

        txt.contents = content;
        
        // 文字スタイル
        txt.textRange.characterAttributes.size = 7;
        var col = new CMYKColor(); col.black = 100;
        txt.textRange.characterAttributes.fillColor = col;
        
        // 位置調整
        var b = target.geometricBounds;
        txt.position = [b[0], b[3] - 10];
    }

    main();
})();