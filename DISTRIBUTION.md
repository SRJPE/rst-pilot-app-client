# Distributing the App to Client iPads

This app ships to client iPads via **EAS internal (ad-hoc) distribution** — there is no App Store or TestFlight listing. That means every iPad must have its device UDID registered with Apple *through EAS* before it can install a build. Registering a device does **not** retroactively unlock an already-built IPA — the device list is baked into the provisioning profile at build time, so the order of operations matters:

1. Register the device(s) first
2. *Then* create the build
3. *Then* share the install link

Skipping step 1 before step 2 means that device simply can't install the result, with no helpful error on the client's end.

## One-time prerequisites

- You're logged into the EAS CLI as a team member with access to this project: `eas login` (check with `eas whoami`)
- The Apple Developer Program membership behind this EAS project has headroom — Apple caps ad-hoc device registrations at **100 devices per membership per year**, reset on the membership's enrollment anniversary, not the calendar year

## Step 1: Register each client iPad's UDID

```bash
eas device:create
```

This is interactive and the easiest path — you don't need physical access to the client's iPad or a Mac + cable:

- It generates a registration link and QR code
- Send/text/AirDrop that link to the client and have them open it **in Safari, on the iPad itself** (not Mail's in-app browser, not Chrome)
- They tap through to install a small configuration profile; this silently captures the UDID and registers it to the project — no need for them to know what a UDID even is
- You can register multiple devices in one run, or run the command again later to add more

If you already have UDIDs on hand (e.g. the client pulled them from Apple Configurator, or an MDM), `eas device:create` also accepts manual UDID entry instead of the link flow.

### Name devices so you can tell them apart later

`eas device:list` has no timestamp and, by default, shows `Name: Unknown` for every device — with several iPads registered, there's no way to tell them apart afterward unless you name them as you go.

Register (or re-confirm) **one client at a time**, and have them complete the registration flow through to the step where it asks for a device name (e.g. "Feather — Crew iPad 1"). This also works for a device that's *already* registered: EAS matches the same UDID to its existing record rather than creating a duplicate, and just updates the name — so you can use this to retroactively label devices that came back as `Unknown` from a past batch registration too.

If a client can't go through the flow again, rename it directly once you know which UDID is theirs:

```bash
eas device:rename --udid <udid> --name "Feather — Crew iPad 1"
```

To figure out *which* UDID is theirs in the first place: the `Class` field in `eas device:list` (e.g. `iPad 7 (WiFi)`, `iPad 6`) can help narrow it down if you know what model their device is (Settings → General → About → Model Name on the iPad), though it won't disambiguate two devices of the identical model/generation — for those, the one-at-a-time re-registration above is the reliable path.

## Step 2: Verify the devices registered

```bash
eas device:list
```

Confirm every client iPad you expect shows up, and that none are still showing `Name: Unknown`, before moving on.

## Step 3: Pick the right build profile

`eas.json` has several `distribution: "internal"` profiles, each pointed at a different server/channel:

| Profile | Server | Channel | Used for |
|---|---|---|---|
| `preview-production` | `jpe-app-server-production` | `production` | Standard production clients (Feather, Yuba, etc.) |
| `preview-testing` | `jpe-app-server` | `testing` | Internal testing |
| `preview-yolo-testing` | `jpe-app-server-ybfmp` | `yolo-testing` | Yolo YBFMP's dedicated backend |
| `preview-dev` | `jpe-app-server` | `dev` | Dev testing |

**For this round (Feather, Yuba) use `preview-production`** — they're standard production-server programs, not a forked deployment like YBFMP got. Double-check this table against `eas.json` if it's been a while; profiles get added/renamed.

## Step 4: Create the distributable build

```bash
eas build -p ios --profile preview-production
```

This must run *after* Step 1/2 for every device you want to include. It takes a while (EAS queues + builds in the cloud) — `eas build:list` or the link the CLI prints will show progress.

## Step 5: Share the install link

Once the build finishes, EAS prints an install link (and the [expo.dev](https://expo.dev) build page has a QR code too). Send it to each client:

- Open it **in Safari, on the iPad**
- Tap Install
- The app icon appears on the home screen like any other app

## After the first install: shipping JS-only updates

Once a device has the app installed from a build on a given channel, you usually **don't** need a new build + re-registration for ordinary bug fixes/feature changes — push an OTA update to that channel instead:

```bash
npm run build-production   # eas update --branch production
```

This reaches every device already running a build on the `production` channel instantly, no device registration or new IPA involved. (`build-testing`/`build-dev` do the same for their channels.)

**This only works for JS/TS changes.** If the change touches native code — new native dependency, Expo SDK upgrade, `app.json` plugin/config changes, new permissions — you're back to a fresh `eas build`, and it will only install on devices already registered at that point.

## Adding one more client iPad later

1. `eas device:create` — register the new device
2. `eas build -p ios --profile preview-production` — a new build whose provisioning profile now includes it (existing devices on the previous build are unaffected and keep receiving OTA updates fine)
3. Share the new build's install link with just the new device — existing devices don't need to reinstall anything

## Troubleshooting

- **Install silently fails / spinner never resolves on the iPad** — almost always means that device's UDID wasn't registered before the build was created. Register it (Step 1) and create a new build (Step 4).
- **Link opened in the wrong browser** — ad-hoc install links must be opened in Safari specifically.
- **"Device limit reached"** when registering — the Apple Developer membership hit its 100-device/year ad-hoc cap; talk to whoever administers the Apple Developer account about options (removing stale/duplicate devices doesn't free up new slots within the same enrollment year — Apple's cap tracks additions, not current count).
- Check who's currently installed vs. who needs a fresh install with `eas device:list` and `eas build:list`.
