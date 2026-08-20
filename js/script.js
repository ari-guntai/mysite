document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("messageBtn");
    const modal = document.getElementById("recommendModal");

    if (button && modal) {
        button.addEventListener("click", function () {
            // モーダルダイアログを開く
            if (typeof modal.showModal === "function") {
                modal.showModal();
            } else {
                alert("おすすめ旅行プラン：月面ステーション & 軌道周回 3泊4日ツアー");
            }
        });
    }

    // ==========================================================================
    // 誓約書の同意ステータス管理
    // ==========================================================================
    const pledgeStatus = document.getElementById("pledgeStatus");

    // 初期状態では「おすすめを見る」ボタンを無効化
    if (button) {
        button.disabled = true;
    }

    // バックドロップ（モーダル外側）クリックで閉じる処理
    if (modal) {
        modal.addEventListener('click', (event) => {
            const rect = modal.getBoundingClientRect();
            const isInModal = (
                rect.top <= event.clientY &&
                event.clientY <= rect.bottom &&
                rect.left <= event.clientX &&
                event.clientX <= rect.right
            );
            if (!isInModal) {
                modal.close();
            }
        });
    }

    // ==========================================================================
    // フォト・ビデオギャラリーの拡大表示モーダル（左にメディア、右に説明文）
    // ==========================================================================
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalMediaWrap = document.getElementById('galleryModalMediaWrap');
    const galleryModalTitle = document.getElementById('galleryModalTitle');
    const galleryModalSub = document.getElementById('galleryModalSub');
    const galleryModalDesc = document.getElementById('galleryModalDesc');
    const galleryModalMeta = document.getElementById('galleryModalMeta');
    const closeGalleryModalBtn = document.getElementById('closeGalleryModalBtn');
    const closeGalleryModalFooterBtn = document.getElementById('closeGalleryModalFooterBtn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // ギャラリーモーダルを開く関数
    function openGalleryModal(item) {
        if (!galleryModal) return;

        const type = item.getAttribute('data-gallery-type') || 'image';
        const src = item.getAttribute('data-gallery-src');
        const title = item.getAttribute('data-gallery-title') || '';
        const sub = item.getAttribute('data-gallery-sub') || '';
        const desc = item.getAttribute('data-gallery-desc') || '';
        const meta = item.getAttribute('data-gallery-meta') || '';

        // 左側メディア要素の動的生成
        if (galleryModalMediaWrap) {
            galleryModalMediaWrap.innerHTML = '';
            if (type === 'video') {
                const video = document.createElement('video');
                video.src = src;
                video.autoplay = true;
                video.controls = true;
                video.playsInline = true;
                video.loop = true;
                galleryModalMediaWrap.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = src;
                img.alt = title;
                galleryModalMediaWrap.appendChild(img);
            }
        }

        // 右側テキスト情報の設定
        if (galleryModalTitle) galleryModalTitle.textContent = title;
        if (galleryModalSub) galleryModalSub.textContent = sub;
        if (galleryModalDesc) galleryModalDesc.textContent = desc;
        if (galleryModalMeta) galleryModalMeta.textContent = meta;

        // モーダルの表示
        if (typeof galleryModal.showModal === 'function') {
            galleryModal.showModal();
        }
    }

    // ギャラリーモーダルを閉じる関数
    function closeGalleryModal() {
        if (!galleryModal) return;
        // モーダル内の動画があれば停止
        if (galleryModalMediaWrap) {
            const video = galleryModalMediaWrap.querySelector('video');
            if (video) {
                video.pause();
            }
        }
        galleryModal.close();
    }

    // 各ギャラリーアイテムへのクリックおよびキーボードイベント登録
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            openGalleryModal(item);
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openGalleryModal(item);
            }
        });
    });

    if (closeGalleryModalBtn) {
        closeGalleryModalBtn.addEventListener('click', closeGalleryModal);
    }
    if (closeGalleryModalFooterBtn) {
        closeGalleryModalFooterBtn.addEventListener('click', closeGalleryModal);
    }

    // ギャラリーモーダルの外側（バックドロップ）クリックで閉じる処理
    if (galleryModal) {
        galleryModal.addEventListener('click', (event) => {
            const rect = galleryModal.getBoundingClientRect();
            const isInModal = (
                rect.top <= event.clientY &&
                event.clientY <= rect.bottom &&
                rect.left <= event.clientX &&
                event.clientX <= rect.right
            );
            if (!isInModal) {
                closeGalleryModal();
            }
        });
    }

    // ==========================================================================
    // Custom Cursor Logic (Only for pointing devices)
    // ==========================================================================
    const isMousePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isMousePointer) {
        document.body.classList.add('has-custom-cursor');

        // カスタムカーソル要素を動的に生成して挿入
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);

        let prevX = 0;
        let prevY = 0;
        let currentAngle = 0;
        let hasMoved = false;

        // マウスの移動イベント
        window.addEventListener('mousemove', (e) => {
            const currentX = e.clientX;
            const currentY = e.clientY;

            // 初回移動時の初期化
            if (!hasMoved) {
                cursor.classList.add('active');
                hasMoved = true;
                prevX = currentX;
                prevY = currentY;
                return;
            }
            const dx = currentX - prevX;
            const dy = currentY - prevY;

            // 一定以上の移動があった場合のみ角度を更新（ブレ防止）
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                // 1. まず目標となる角度（-180〜180度）を計算
                const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                
                // 2. 現在の角度と目標角度の「差」を計算
                let diff = targetAngle - (currentAngle % 360);

                // 3. 差が180度を超える場合は、逆回り（最短距離）になるように補正
                if (diff > 180) {
                    diff -= 360;
                } else if (diff < -180) {
                    diff += 360;
                }

                // 4. 現在の角度に差分を足し合わせる（360度を超えても累積され続け、境界値での逆回転を防ぐ）
                currentAngle += diff;
            }

            // カーソルの中心をマウス位置に合わせる (サイズ32pxの半分の16px)
            const posX = currentX - 16;
            const posY = currentY - 16;

            cursor.style.transform = `translate(${posX}px, ${posY}px) rotate(${currentAngle}deg)`;

            prevX = currentX;
            prevY = currentY;
        });

        // 画面への出入り監視
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            hasMoved = false;
        });
        document.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });

        // リンク・ボタン・カスタムチェックボックス等へのホバー判定 (イベント委譲)
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .btn, [role="button"], label.checkbox-container');
            if (target) {
                cursor.classList.add('hovered');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, .btn, [role="button"], label.checkbox-container');
            if (target) {
                cursor.classList.remove('hovered');
            }
        });
    }

    // ==========================================================================
    // ARG (代替現実ゲーム) フラグ管理システム
    // ==========================================================================
    const argState = {
        meteor: false,   // フラグ1: 隕石クリック
        pledge: false,   // フラグ2: 誓約書署名
        signal: false,   // フラグ3: ギャラリー暗号シグナル
        protocol: false  // フラグ4: 誓約書第4条プロトコル
    };

    const argHud = document.getElementById('argHud');
    const argHudCounter = document.getElementById('argHudCounter');
    const argHudMessage = document.getElementById('argHudMessage');
    const classifiedTerminal = document.getElementById('classifiedTerminal');
    const classifiedIndicator = document.getElementById('classifiedIndicator');
    const openTerminalBtn = document.getElementById('openTerminalBtn');
    const closeTerminalBtn = document.getElementById('closeTerminalBtn');
    let hudTimeout = null;

    // 画面に微細なグリッチ演出を走らせる関数
    function triggerGlitchEffect() {
        document.body.classList.add('arg-glitch-active');
        setTimeout(() => {
            document.body.classList.remove('arg-glitch-active');
        }, 400);
    }

    // フラグの更新とHUD通知
    function setArgFlag(key, logMessage) {
        if (argState[key]) return; // 既に達成済みなら何もしない

        argState[key] = true;
        triggerGlitchEffect();

        // 達成フラグ数のカウント
        const completedCount = Object.values(argState).filter(Boolean).length;
        
        // HUDの表示更新
        if (argHud && argHudCounter && argHudMessage) {
            argHudCounter.textContent = `${completedCount} / 4`;
            argHudMessage.textContent = logMessage || `シグナル検知 (${completedCount}/4)`;
            argHud.classList.add('visible', 'flash');

            clearTimeout(hudTimeout);
            hudTimeout = setTimeout(() => {
                argHud.classList.remove('flash');
            }, 3000);
        }

        // 4つのフラグが全て揃った場合の隠しページ出現
        if (completedCount === 4) {
            setTimeout(() => {
                openClassifiedTerminal();
            }, 800);
        }
    }

    // 隠し機密端末を開く
    function openClassifiedTerminal() {
        if (!classifiedTerminal) return;
        classifiedTerminal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 背後スクロール固定

        // フッターの再アクセスインジケーターを常時表示
        if (classifiedIndicator) {
            classifiedIndicator.style.display = 'block';
        }
    }

    // 隠し機密端末を閉じる
    function closeClassifiedTerminal() {
        if (!classifiedTerminal) return;
        classifiedTerminal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // 端末再アクセスボタン
    if (openTerminalBtn) {
        openTerminalBtn.addEventListener('click', openClassifiedTerminal);
    }

    // 端末切断（閉じる）ボタン
    if (closeTerminalBtn) {
        closeTerminalBtn.addEventListener('click', closeClassifiedTerminal);
    }

    // 端末内タブ切り替え
    const tabButtons = document.querySelectorAll('.terminal-tabs .tab-btn');
    const tabPanes = document.querySelectorAll('.terminal-tab-pane');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTabId = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(targetTabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // ギミック1: ミニ隕石の回転 ＆ フラグ1セット
    // ==========================================================================
    const miniMeteor = document.getElementById("mini-meteor");
    if (miniMeteor) {
        miniMeteor.addEventListener("click", () => {
            if (miniMeteor.classList.contains("spin")) {
                return;
            }
            miniMeteor.classList.add("spin");
            
            // フラグ1: 隕石クリック
            setArgFlag('meteor', '[SIGNAL-01] 隕石コアからの共鳴パルスを検知');

            setTimeout(() => {
                miniMeteor.classList.remove("spin");
            }, 800);
        });

        miniMeteor.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                miniMeteor.click();
            }
        });
    }

    // ==========================================================================
    // ギミック3: ギャラリー画像の暗号化シグナル傍受 ＆ フラグ3セット
    // ==========================================================================
    const gallerySignalTrigger = document.querySelector('[data-arg-trigger="gallery-signal"]');
    if (gallerySignalTrigger) {
        gallerySignalTrigger.addEventListener('click', () => {
            gallerySignalTrigger.classList.add('signal-intercepted');
            setArgFlag('signal', '[SIGNAL-03] 探査画像から深宇宙伝送パケットを傍受');
        });
        gallerySignalTrigger.addEventListener('keydown', (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                gallerySignalTrigger.click();
            }
        });
    }

    // ==========================================================================
    // ギミック4: 誓約書第4条の機密プロトコル接触 ＆ フラグ4セット
    // ==========================================================================
    const pledgeArticle4 = document.getElementById('pledgeArticle4');
    if (pledgeArticle4) {
        pledgeArticle4.addEventListener('click', () => {
            pledgeArticle4.classList.add('protocol-unlocked');
            setArgFlag('protocol', '[SIGNAL-04] プロトコル772：生体意識退避の裏条項を照合');
        });
        pledgeArticle4.addEventListener('keydown', (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pledgeArticle4.click();
            }
        });
    }

    // ==========================================================================
    // 誓約書のアニメーションと署名ロジック (フラグ2: 署名完了)
    // ==========================================================================
    const pdfDocument = document.getElementById('pdfDocument');
    const pdfItems = document.querySelectorAll('.pdf-item');
    const signButton = document.getElementById('signButton');
    const signatureNameInput = document.getElementById('signatureName');
    const signatureForm = document.getElementById('signatureForm');
    const signatureResult = document.getElementById('signatureResult');
    const sigDate = document.getElementById('sigDate');
    const sigName = document.getElementById('sigName');

    // 1. スクロールによるフェードインアニメーション
    if (pdfDocument && pdfItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pdfItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('fade-in');
                        }, index * 400);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        observer.observe(pdfDocument);
    }

    // 2. 署名ボタンのロジック (フラグ2をセット)
    if (signButton) {
        signButton.addEventListener('click', () => {
            const nameValue = signatureNameInput.value.trim();
            if (!nameValue) {
                alert('氏名をフルネームで入力してください。');
                return;
            }

            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const date = now.getDate();
            
            sigDate.textContent = `${year}年${month}月${date}日`;
            sigName.textContent = nameValue;

            signatureForm.style.display = 'none';
            signatureResult.style.display = 'inline-block';

            if (pledgeStatus) {
                pledgeStatus.textContent = "同意済み";
                pledgeStatus.classList.add("agreed");
            }
            if (button) {
                button.disabled = false;
            }

            // フラグ2: 署名完了
            setArgFlag('pledge', '[SIGNAL-02] 生体ID署名および権利委託を承認');
        });
    }
});