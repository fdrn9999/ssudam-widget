use tauri::{
    AppHandle, Emitter, Manager,
    WebviewWindowBuilder, WebviewUrl,
    menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem},
    tray::TrayIconBuilder,
};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[tauri::command]
fn open_window(app: AppHandle, label: &str, title: &str, width: f64, height: f64) {
    if let Some(window) = app.get_webview_window(label) {
        let _ = window.show();
        let _ = window.set_focus();
        return;
    }
    let url = WebviewUrl::App(format!("index.html?window={}", label).into());
    let _ = WebviewWindowBuilder::new(&app, label, url)
        .title(title)
        .inner_size(width, height)
        .resizable(false)
        .decorations(true)
        .center()
        .build();
}

#[tauri::command]
fn open_settings(app: AppHandle) {
    open_window(app, "settings", "설정", 400.0, 500.0);
}

#[tauri::command]
fn open_stats(app: AppHandle) {
    open_window(app, "stats", "오늘의 통계", 380.0, 420.0);
}

#[tauri::command]
fn open_about(app: AppHandle) {
    open_window(app, "about", "정보", 380.0, 420.0);
}

#[tauri::command]
fn set_main_window_size(app: AppHandle, width: f64, height: f64) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize { width, height }));
    }
}

fn build_tray(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let timer_toggle = MenuItemBuilder::with_id("timer-toggle", "▶ 타이머 시작/일시정지").build(app)?;
    let new_cig = MenuItemBuilder::with_id("new-cigarette", "🔄 새 담배").build(app)?;
    let memo_toggle = MenuItemBuilder::with_id("memo-toggle", "📝 메모 열기/닫기").build(app)?;
    let flick_ash = MenuItemBuilder::with_id("flick-ash", "💨 재떨기").build(app)?;
    let settings = MenuItemBuilder::with_id("settings", "⚙️ 설정").build(app)?;
    let stats = MenuItemBuilder::with_id("stats", "📊 오늘의 통계").build(app)?;
    let about = MenuItemBuilder::with_id("about", "ℹ️ 정보").build(app)?;
    let hide = MenuItemBuilder::with_id("hide", "➖ 숨기기").build(app)?;
    let quit = MenuItemBuilder::with_id("quit", "✕ 종료").build(app)?;
    let version = MenuItemBuilder::with_id("version", "담타 위젯 v1.0.0")
        .enabled(false)
        .build(app)?;
    let sep = PredefinedMenuItem::separator(app)?;

    let menu = MenuBuilder::new(app)
        .items(&[
            &timer_toggle,
            &new_cig,
            &memo_toggle,
            &flick_ash,
            &settings,
            &stats,
            &about,
            &hide,
            &quit,
            &sep,
            &version,
        ])
        .build()?;

    let icon = app.default_window_icon().cloned()
        .expect("앱 아이콘이 없습니다");

    let _tray = TrayIconBuilder::new()
        .icon(icon)
        .menu(&menu)
        .tooltip("담타 위젯")
        .on_menu_event(move |app, event| {
            let id = event.id().as_ref();
            match id {
                "timer-toggle" | "new-cigarette" | "memo-toggle" | "flick-ash" => {
                    let _ = app.emit("tray-event", id);
                }
                "settings" => {
                    open_window(app.clone(), "settings", "설정", 400.0, 500.0);
                }
                "stats" => {
                    open_window(app.clone(), "stats", "오늘의 통계", 380.0, 420.0);
                }
                "about" => {
                    open_window(app.clone(), "about", "정보", 380.0, 420.0);
                }
                "hide" => {
                    if let Some(w) = app.get_webview_window("main") {
                        let _ = w.hide();
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}

fn register_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let shortcut_d: Shortcut = "ctrl+shift+d".parse()?;
    let shortcut_s: Shortcut = "ctrl+shift+s".parse()?;
    let shortcut_n: Shortcut = "ctrl+shift+n".parse()?;
    let shortcut_a: Shortcut = "ctrl+shift+a".parse()?;
    let shortcut_m: Shortcut = "ctrl+shift+m".parse()?;

    app.global_shortcut().on_shortcuts(
        [shortcut_d, shortcut_s, shortcut_n, shortcut_a, shortcut_m],
        move |app, shortcut, event| {
            if event.state != ShortcutState::Pressed {
                return;
            }
            let key = format!("{}", shortcut);
            let event_name = if key.contains("+D") || key.contains("+d") {
                "shortcut-toggle-visibility"
            } else if key.contains("+S") || key.contains("+s") {
                "timer-toggle"
            } else if key.contains("+N") || key.contains("+n") {
                "new-cigarette"
            } else if key.contains("+A") || key.contains("+a") {
                "flick-ash"
            } else if key.contains("+M") || key.contains("+m") {
                "memo-toggle"
            } else {
                return;
            };

            if event_name == "shortcut-toggle-visibility" {
                if let Some(w) = app.get_webview_window("main") {
                    if w.is_visible().unwrap_or(false) {
                        let _ = w.hide();
                    } else {
                        let _ = w.show();
                        let _ = w.set_focus();
                    }
                }
            } else {
                let _ = app.emit("tray-event", event_name);
            }
        },
    )?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--minimized"])))
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(w) = app.get_webview_window("main") {
                let _ = w.show();
                let _ = w.set_focus();
            }
        }))
        .invoke_handler(tauri::generate_handler![
            open_settings,
            open_stats,
            open_about,
            set_main_window_size,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            build_tray(&handle).expect("트레이 아이콘 생성 실패");
            if let Err(e) = register_shortcuts(&handle) {
                eprintln!("글로벌 단축키 등록 실패: {}", e);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("담타 위젯 실행 오류");
}
