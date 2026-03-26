# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install
# If that fails:
npm install --legacy-peer-deps

# Start development (uses Expo Go)
npm run reset-cache

# Run on iOS simulator (native build)
npm run ios

# Build development simulator build via EAS
npm run build-simulator

# Deploy to EAS update branches
npm run build-production   # production branch
npm run build-testing      # testing branch
npm run build-dev          # dev branch
```

There is no test runner configured in this project.

## Environment Variables

Create a `.env` file with:

```
EXPO_PUBLIC_BASE_URL=          # Server URL (local or Azure)
EXPO_PUBLIC_CLIENT_ID=         # Azure AD B2C client ID
EXPO_PUBLIC_CLIENT_SECRET_VALUE=
EXPO_PUBLIC_CLIENT_SECRET_ID=
```

The server URL is read via `Constants.expoConfig?.extra?.EXPO_PUBLIC_BASE_URL` at runtime (see `src/api/axiosConfig.ts`).

## Architecture Overview

This is a React Native / Expo tablet app for field data collection at Rotary Screw Trap (RST) monitoring sites on California rivers, built for the JPE (Juvenile Production Estimate) program.

### Entry Point & Providers

`App.tsx` wraps the app in `GluestackUIProvider` -> `AppContainer` (`src/index.tsx`) which layers:
- Redux `Provider` + `PersistGate` (redux-persist via AsyncStorage)
- `NavigationContainer`
- `NativeBaseProvider` (themed via `src/styles/theme.ts`)
- `react-native-paper` Provider
- `SlideAlertProvider` and `OnStartupProvider`

The root navigator is `MainDrawerNavigator` — a drawer that gates all screens behind Azure AD B2C auth (`userCredentials.azureUid`). When no user is authenticated, only `SignIn` is shown.

### Navigation Structure

```
MainDrawerNavigator (drawer)
├── Sign In
├── Home
├── Profile
├── Permit Info
├── Generate Report
├── Quality Control  →  QCNavigation (stack)
│   ├── Select Program to QC (ProgramQC)
│   ├── Select Data to QC (QCMain)
│   ├── Trap QC, CatchMeasureQC, CatchCategoricalQC, CatchFishCountQC
│   ├── PartialRecordsQC, EfficiencyQC
├── Inspector
├── Mark Recapture  →  MarkRecaptureFormRoot → MarkRecaptureStackNavigator
├── Trap Visit Form →  TrapVisitFormRoot → FormStackNavigation (stack)
│   ├── Visit Setup → Trap Operations → Fish Processing
│   ├── Fish Input → Add Fish / Batch Count / Multi Species
│   ├── Trap Post-Processing → Fish Holding
│   ├── Incomplete Sections → End Trapping
│   └── Warning screens: High Flows, High Temperatures, Non Functional Trap, No Fish Caught
├── Monitoring Program  →  MonitoringProgramRoot → MonitoringProgramStackNavigator
│   └── Create New Program  →  CreateNewProgramStackNavigator
└── Input Turbidity, Genetics
```

### Redux State

All state lives in `src/redux/`. The root reducer (`src/redux/reducers/index.ts`) combines slices grouped by feature. Many slices are persisted via `redux-persist` to AsyncStorage.

Key slice groups:
- **Form slices** (`formSlices/`): `visitSetup`, `trapOperations`, `fishProcessing`, `fishInput`, `trapPostProcessing`, `batchCount`, `addMarksOrTags`, `addGeneticSamples`, `navigation`, `tabSlice`, `paperEntry`
- **Mark recapture slices** (`markRecaptureSlices/`): `releaseTrial`, `releaseTrialDataEntry`, `fishHolding`, `markRecaptureCache`, `markRecaptureNavigation`
- **Post bundlers** (`postSlices/`): `trapVisitFormPostBundler`, `markRecapturePostBundler`, `monitoringProgramPostBundler` — these aggregate form data and handle async API submission via `createAsyncThunk`
- **Create new program slices** (`createNewProgramSlices/`): `trappingSites`, `crewMembers`, `trappingProtocols`, `efficiencyTrialProtocols`, `permitInformation`, `multipleTraps`
- **Global slices**: `dropdowns` (lookup values fetched from API), `userCredentials`, `userAuth`, `connectivity`, `personnel`, `visitSetupDefaults`, `slideAlert`

### API Layer

`src/api/axiosConfig.ts` creates a single axios instance pointed at `EXPO_PUBLIC_BASE_URL`. The interceptor:
1. Attaches `Authorization: Bearer <accessToken>` and `idToken` headers from `expo-secure-store`
2. Auto-refreshes tokens against the Azure B2C token endpoint when expired
3. Transforms responses: converts UTC strings to local time, camelizes keys via `humps`

Tokens are stored in `expo-secure-store` (keys: `userAccessToken`, `userIdToken`, `userRefreshToken`, `userAccessTokenExpiresAt`).

### Form Flow (Trap Visit)

The trap visit form is a multi-step wizard driven by `navigationSlice`. Steps are tracked as numbered entries (1–16); `activeStep` determines which screen is shown. The `ProgressHeader` component renders a step indicator. `NavButtons` handle forward/backward navigation and call `markStepCompleted` on the relevant slice.

### Data Submission (Offline-First)

Post bundler slices collect completed form data locally (persisted to AsyncStorage). When connectivity is available, they POST to the server. The `connectivity` slice tracks `isConnected` and `isInternetReachable` via `@react-native-community/netinfo`.

### UI Libraries

- **NativeBase** — primary component library (legacy, being phased toward Gluestack)
- **Gluestack UI v1** — newer components (`@gluestack-ui/*`), configured in `components/ui/`
- **NativeWind / Tailwind** — utility classes
- **react-native-paper** — some Material Design components
- **victory-native** — charts in QC screens
- **Formik + Yup** — form state and validation within screens
