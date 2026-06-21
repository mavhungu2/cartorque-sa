# Car Torque SA — Native Apps

True platform-native apps that consume the live REST API at
`https://cartorque-sa--cartorque-sa.us-east4.hosted.app/api/v1` (see `src/app/api/v1/`).
No Firebase SDK client-side — all data flows through the server-mediated API.

| | iOS | Android |
|---|---|---|
| Language | Swift 5.9 / SwiftUI | Kotlin 2.1 / Jetpack Compose |
| Min OS | iOS 17 | Android 8.0 (API 26) |
| Bundle/App ID | `za.co.cartorquesa.app` | `za.co.cartorquesa.app` |
| Architecture | MVVM, `@Observable`, URLSession async/await | MVVM, ViewModel + StateFlow, OkHttp + kotlinx.serialization, Coil |

Both implement: Browse grid + facet-bound filter sheet, listing detail (photo pager,
specs, WhatsApp/call/email, finance CTA, YouTube review), full NCA finance form
(SA-ID Luhn validation, POPIA consents, illustrative instalment, NCR disclaimer),
Videos, and More tabs. Brand: yellow `#FFD400` / black ink, light mode only.

## iOS — build & run

The Xcode project is generated from `project.yml` (not committed) via
[xcodegen](https://github.com/yonyz/XcodeGen) (`brew install xcodegen`).

```bash
cd apps/ios
xcodegen generate
xcodebuild -project CarTorqueSA.xcodeproj -scheme CarTorqueSA \
  -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 16e' build
# install + run on a booted simulator:
xcrun simctl install booted "$(find ~/Library/Developer/Xcode/DerivedData/CarTorqueSA-*/Build/Products/Debug-iphonesimulator -name CarTorqueSA.app | head -1)"
xcrun simctl launch booted za.co.cartorquesa.app
```

## Android — build & run

Requires JDK 17 (AGP 8.9.1 does not support newer JDKs); the path is pinned in
`gradle.properties`. Create `local.properties` with your SDK path if missing
(`sdk.dir=$HOME/Library/Android/sdk`).

```bash
cd apps/android
JAVA_HOME=$(/usr/libexec/java_home -v 17) ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell monkey -p za.co.cartorquesa.app -c android.intent.category.LAUNCHER 1
```

## Store submission (not yet done — see plan)

Both need: store developer accounts, app icons (glyph-only mark on `#FFD400`),
screenshots, the privacy policy URL (`/privacy`, already live), and the Play
Financial-Features declaration (lead generator to NCR-registered providers, not a
credit provider). iOS App Review notes must cover the pre-moderation model and that
reviewers' finance submissions land in the admin queue.
