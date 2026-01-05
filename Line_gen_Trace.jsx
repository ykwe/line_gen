/*
    Line Generator [Trace] Ver 3.2
    
    Created by ykwe with Gemini for Adobe Illustrator
    This is a personally developed alpha version.
    We apologize for any bugs or issues that may occur.
    We cannot be held responsible for any problems.

*/

(function() {
    // --- グローバル変数 ---
    var seedArray = [];

    // --- メイン処理 ---
    function main() {
        if (app.documents.length === 0) {
            alert("ドキュメントを開いてから実行してください。");
            return;
        }

        var sel = app.activeDocument.selection;
        if (sel.length === 0) {
            alert("パスを選択してから実行してください。");
            return;
        }

        // UI構築
        var dialog = new Window("dialog", "なぞり生成 v3.2");
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
        pnlBasic.spacing = 8;

        // --- モード ---
        var grpMode = pnlBasic.add("group");
        grpMode.add("statictext", undefined, "モード:");
        var rbSingle = grpMode.add("radiobutton", undefined, "一筆書き");
        var rbSplit = grpMode.add("radiobutton", undefined, "分割パス");
        rbSingle.value = true;

        // --- 回数 ---
        var grpCount = pnlBasic.add("group");
        grpCount.add("statictext", undefined, "回数 (往復数):");
        var inpCount = grpCount.add("edittext", undefined, "10");
        inpCount.characters = 6;

        // --- 線幅 ---
        var grpStroke = pnlBasic.add("group");
        grpStroke.add("statictext", undefined, "線幅:");
        var inpStroke = grpStroke.add("edittext", undefined, "0.5");
        inpStroke.characters = 6;
        grpStroke.add("statictext", undefined, "pt");

        // ===============================================
        // 2. パラメータパネル
        // ===============================================
        var pnlParams = dialog.add("panel", undefined, "パラメータ");
        pnlParams.alignChildren = ["left", "top"];
        pnlParams.orientation = "column";
        pnlParams.spacing = 6;

        // --- 変形 ---
        var grpStyle = pnlParams.add("group");
        grpStyle.add("statictext", undefined, "変形:");
        var rbSharp = grpStyle.add("radiobutton", undefined, "サイン波型");
        var rbSmooth = grpStyle.add("radiobutton", undefined, "ループ型");
        rbSharp.value = true;

        // --- 中心の移動範囲 ---
        var grpRange = pnlParams.add("group");
        grpRange.add("statictext", undefined, "中心の移動範囲:");
        var inpRange = grpRange.add("edittext", undefined, "5.0");
        inpRange.characters = 6;
        grpRange.add("statictext", undefined, "pt");

        // --- 長さ/位置の変化 ---
        var grpVar = pnlParams.add("group");
        grpVar.add("statictext", undefined, "長さ/位置の変化:");
        var inpVar = grpVar.add("edittext", undefined, "20.0");
        inpVar.characters = 6;
        grpVar.add("statictext", undefined, "%");

        // --- 線のゆがみ (直進率) ---
        var grpStab = pnlParams.add("group");
        grpStab.add("statictext", undefined, "線のゆがみ (直進率):");
        var inpStab = grpStab.add("edittext", undefined, "5.0");
        inpStab.characters = 6;

        // --- 生成方式 ---
        var grpSamp = pnlParams.add("group");
        grpSamp.add("statictext", undefined, "生成方式:");
        var rbDist = grpSamp.add("radiobutton", undefined, "距離ベース");
        var rbSeg = grpSamp.add("radiobutton", undefined, "分割数ベース");
        rbDist.value = true; // デフォルト

        // --- 密度 / 分割数 (動的ラベル) ---
        var grpRes = pnlParams.add("group");
        var lblRes = grpRes.add("statictext", undefined, "密度 (100ptあたりの点数):"); // 初期値
        var inpRes = grpRes.add("edittext", undefined, "24");
        inpRes.characters = 6;

        // UIイベント: ラベル切り替え
        rbDist.onClick = function() {
            lblRes.text = "密度 (100ptあたりの点数):";
        }
        rbSeg.onClick = function() {
            lblRes.text = "分割数 (セグメントごと):";
        }

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
            var params = {
                pathMode: rbSingle.value ? "SINGLE" : "SPLIT",
                samplingMode: rbDist.value ? "DISTANCE" : "SEGMENT",
                turnStyle: rbSharp.value ? "SHARP" : "SMOOTH",
                count: parseFloat(inpCount.text),
                range: parseFloat(inpRange.text),
                variance: parseFloat(inpVar.text),
                stability: parseFloat(inpStab.text),
                stroke: parseFloat(inpStroke.text),
                resolution: parseInt(inpRes.text), // 密度 または 分割数
                log: chkLog.value
            };

            // バリデーション
            if (isNaN(params.count) || params.count < 1) params.count = 1;
            if (isNaN(params.resolution) || params.resolution < 2) params.resolution = 2;
            if (isNaN(params.stability) || params.stability <= 0.1) params.stability = 0.1;

            processTrace(params);
        }
    }

    // --- ノイズ関連 ---
    function initSeeds(count) {
        seedArray = [];
        for(var i=0; i<count; i++) seedArray.push(Math.random());
    }
    
    function getSmoothRandom(t, offsetIdx) {
        var i = Math.floor(t);
        var f = t - i;
        var idx1 = (i + offsetIdx) % seedArray.length;
        var idx2 = (i + 1 + offsetIdx) % seedArray.length;
        var v1 = seedArray[idx1];
        var v2 = seedArray[idx2];
        var smoothT = f * f * (3 - 2 * f);
        return v1 * (1 - smoothT) + v2 * smoothT;
    }

    // ===============================================
    // トレース処理
    // ===============================================
    function processTrace(p) {
        var sel = app.activeDocument.selection;
        var allBasePaths = []; 

        for (var i = 0; i < sel.length; i++) {
            extractPaths(sel[i], allBasePaths, p);
        }

        if (allBasePaths.length === 0) {
            alert("選択範囲内に処理可能なパスが見つかりませんでした。");
            return;
        }

        var maxPts = 0;
        for(var k=0; k<allBasePaths.length; k++) maxPts = Math.max(maxPts, allBasePaths[k].length);
        initSeeds((maxPts * p.count) + 1000);

        var finalPathsList = [];
        var traceTimeStep = 1.0 / (p.stability > 0.1 ? p.stability : 0.1);

        for (var i = 0; i < allBasePaths.length; i++) {
            var basePoints = allBasePaths[i];
            if (basePoints.length < 2) continue;

            var singlePointsBuffer = [];
            
            for (var c = 0; c < p.count; c++) {
                var isReturn = (c % 2 !== 0);
                var currentStrokePoints = (p.pathMode === "SPLIT") ? [] : null;

                var startIdx = 0, endIdx = basePoints.length, step = 1;
                
                if (p.pathMode === "SINGLE" && isReturn) {
                    startIdx = basePoints.length - 1;
                    endIdx = -1;
                    step = -1;
                }

                for (var k = startIdx; k !== endIdx; k += step) {
                    var bp = basePoints[k];
                    
                    var time = (c * 20.0) + (k * traceTimeStep); 
                    
                    var dx = (getSmoothRandom(time, 0) * 2 - 1) * p.range;
                    var dy = (getSmoothRandom(time, 50) * 2 - 1) * p.range;
                    var varScale = 1.0 + (getSmoothRandom(time, 80) * 2 - 1) * (p.variance / 200.0);
                    
                    var newPt = [bp[0] + dx * varScale, bp[1] + dy * varScale];

                    if (p.turnStyle === "SMOOTH") {
                         var loopRad = p.range * 0.5;
                         newPt[0] += loopRad * Math.cos(k * 0.5);
                         newPt[1] += loopRad * Math.sin(k * 0.5);
                    }

                    if (p.pathMode === "SPLIT") {
                        currentStrokePoints.push(newPt);
                    } else {
                        singlePointsBuffer.push(newPt);
                    }
                }

                if (p.pathMode === "SPLIT") {
                    finalPathsList.push(currentStrokePoints);
                }
            }
            
            if (p.pathMode === "SINGLE") {
                finalPathsList.push(singlePointsBuffer);
            }
        }

        drawPaths(finalPathsList, p);
    }

    // --- パス抽出 ---
    function extractPaths(item, list, params) {
        if (item.typename === "PathItem") {
            list.push(samplePath(item, params));
        } 
        else if (item.typename === "CompoundPathItem") {
            for (var i = 0; i < item.pathItems.length; i++) {
                list.push(samplePath(item.pathItems[i], params));
            }
        } 
        else if (item.typename === "GroupItem") {
            for (var j = 0; j < item.pageItems.length; j++) {
                extractPaths(item.pageItems[j], list, params);
            }
        }
    }

    // --- サンプリング ---
    function samplePath(pathItem, params) {
        var pts = pathItem.pathPoints;
        var sampled = [];
        if (pts.length < 2) return sampled;

        for (var i = 0; i < pts.length; i++) {
            if (i === pts.length - 1 && !pathItem.closed) {
                sampled.push(pts[i].anchor);
                break;
            }

            var p0 = pts[i].anchor;
            var p1 = pts[i].rightDirection;
            var nextIdx = (i + 1) % pts.length;
            var p2 = pts[nextIdx].leftDirection;
            var p3 = pts[nextIdx].anchor;

            var steps;
            if (params.samplingMode === "DISTANCE") {
                var segLen = getBezierSegmentLength(p0, p1, p2, p3);
                steps = Math.max(2, Math.ceil(segLen * (params.resolution / 100.0)));
            } else {
                steps = params.resolution;
            }

            for (var t = 0; t < steps; t++) {
                var rate = t / steps;
                sampled.push(getCubicBezierPt(p0, p1, p2, p3, rate));
            }
        }
        if (pathItem.closed) sampled.push(pts[0].anchor);
        
        return sampled;
    }

    function getBezierSegmentLength(p0, p1, p2, p3) {
        var steps = 10;
        var len = 0;
        var prev = p0;
        for (var i = 1; i <= steps; i++) {
            var t = i / steps;
            var curr = getCubicBezierPt(p0, p1, p2, p3, t);
            len += dist(prev, curr);
            prev = curr;
        }
        return len;
    }
    
    function dist(p1, p2) {
        return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2));
    }

    function getCubicBezierPt(p0, p1, p2, p3, t) {
        var cx = 3 * (p1[0] - p0[0]);
        var bx = 3 * (p2[0] - p1[0]) - cx;
        var ax = p3[0] - p0[0] - cx - bx;
        var x = (ax * Math.pow(t, 3)) + (bx * Math.pow(t, 2)) + (cx * t) + p0[0];
        var cy = 3 * (p1[1] - p0[1]);
        var by = 3 * (p2[1] - p1[1]) - cy;
        var ay = p3[1] - p0[1] - cy - by;
        var y = (ay * Math.pow(t, 3)) + (by * Math.pow(t, 2)) + (cy * t) + p0[1];
        return [x, y];
    }

    // --- 描画処理 ---
    function drawPaths(pathsList, p) {
        var doc = app.activeDocument;
        var color = new CMYKColor();
        color.black = 100;

        var masterGroup = doc.groupItems.add();
        masterGroup.name = "Trace_" + p.pathMode;

        var tension = 0.15;
        var handleMult = 0.15;

        for (var i = 0; i < pathsList.length; i++) {
            var points = pathsList[i];
            if (points.length < 2) continue;

            var pathItem = masterGroup.pathItems.add();
            pathItem.filled = false;
            pathItem.stroked = true;
            pathItem.strokeColor = color;
            pathItem.strokeWidth = p.stroke;
            
            if (p.turnStyle === "SMOOTH" || p.pathMode === "SINGLE") {
                pathItem.strokeJoin = StrokeJoin.ROUNDENDJOIN;
                pathItem.strokeCap = StrokeCap.ROUNDENDCAP;
            } else {
                pathItem.strokeJoin = StrokeJoin.MITERENDJOIN;
                pathItem.strokeCap = StrokeCap.BUTTENDCAP;
            }

            for (var j = 0; j < points.length; j++) {
                var pt = pathItem.pathPoints.add();
                pt.anchor = points[j];

                if (j === 0) {
                    pt.leftDirection = pt.anchor;
                    if (points.length > 1) {
                        var next = points[j+1];
                        var tangent = vecSub(next, points[j]);
                        pt.rightDirection = vecAdd(pt.anchor, vecMult(tangent, tension));
                    }
                } else if (j === points.length - 1) {
                    pt.rightDirection = pt.anchor;
                    var prev = points[j-1];
                    var tangent = vecSub(points[j], prev);
                    pt.leftDirection = vecSub(pt.anchor, vecMult(tangent, tension));
                } else {
                    var prev = points[j-1];
                    var next = points[j+1];
                    var tangent = vecSub(next, prev);
                    pt.leftDirection = vecSub(pt.anchor, vecMult(tangent, handleMult));
                    pt.rightDirection = vecAdd(pt.anchor, vecMult(tangent, handleMult));
                }
            }
        }

        if (p.log) createLog(doc, masterGroup, p);
    }

    // --- ユーティリティ ---
    function vecAdd(v1, v2) { return [v1[0] + v2[0], v1[1] + v2[1]]; }
    function vecSub(v1, v2) { return [v1[0] - v2[0], v1[1] - v2[1]]; }
    function vecMult(v, s) { return [v[0] * s, v[1] * s]; }

    // --- ログ出力 ---
    function createLog(doc, target, p) {
        var txt = doc.textFrames.add();
        var modeStr = (p.pathMode === "SINGLE") ? "一筆書き" : "分割パス";
        var styleStr = (p.turnStyle === "SHARP") ? "サイン波型" : "ループ型";
        
        // サンプリング情報を整形
        var sampInfo = "";
        if (p.samplingMode === "DISTANCE") {
            sampInfo = "距離ベース - 密度: " + p.resolution;
        } else {
            sampInfo = "分割ベース - 個数: " + p.resolution;
        }
        
        var content = "Output Log:\n";
        content += "[線] 線幅: " + p.stroke + " pt / 回数: " + p.count + "\n";
        content += "[モード] " + modeStr + "\n";
        content += "[変形] " + styleStr + " (移動範囲: " + p.range + " pt / 変化: " + p.variance + "% / 直進率: " + p.stability + " / " + sampInfo + ")\n";
        content += "[モデル] Trace Line Gen v3.2";
        
        txt.contents = content;
        txt.textRange.characterAttributes.size = 7;
        
        var b = target.geometricBounds;
        txt.position = [b[0], b[3] - 10];
    }

    main();
})();