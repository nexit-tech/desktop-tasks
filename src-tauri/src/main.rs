#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use winreg::enums::*;
use winreg::RegKey;
use std::env;

// Comando para VERIFICAR se está ativo
#[tauri::command]
fn check_autostart() -> bool {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let path = "Software\\Microsoft\\Windows\\CurrentVersion\\Run";
    
    if let Ok(key) = hkcu.open_subkey(path) {
        // Tenta ler o valor "DesktopTasks". Se conseguir, é porque está ativado.
        return key.get_value::<String, _>("DesktopTasks").is_ok();
    }
    false
}

// Comando para LIGAR/DESLIGAR
#[tauri::command]
fn set_autostart(enable: bool) {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let path = "Software\\Microsoft\\Windows\\CurrentVersion\\Run";
    
    // Abre (ou cria) a chave de registro
    if let Ok((key, _)) = hkcu.create_subkey(path) {
        if enable {
            // Pega o caminho onde o .exe está rodando agora
            if let Ok(exe_path) = env::current_exe() {
                let _ = key.set_value("DesktopTasks", &exe_path.to_str().unwrap());
            }
        } else {
            // Remove o registro
            let _ = key.delete_value("DesktopTasks");
        }
    }
}

fn main() {
    tauri::Builder::default()
        // Registra os nossos comandos manuais
        .invoke_handler(tauri::generate_handler![check_autostart, set_autostart])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}