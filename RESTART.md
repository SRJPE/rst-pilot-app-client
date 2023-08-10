# Restart

Notes to ourselves for picking up for next TO Contract

## Client

### In Progress Tickets

#### [Generate Report #232](https://github.com/FlowWest/rst-pilot-app-client/issues/232)

#### [Fix save on non standard workflow #163](https://github.com/FlowWest/rst-pilot-app-client/issues/163)

#### [Remaining testing fixes within data collection section #240](https://github.com/FlowWest/rst-pilot-app-client/issues/240)

#### [QC - Convert the marks graph within "Catch" > "Categorical Observations" to a scatterplot #246](https://github.com/FlowWest/rst-pilot-app-client/issues/246)

- Branch: convert-marks-scatterplot
- Status: Incomplete, needs more work
- [x] Implemented logic that uniquely identifies the count of mark combos (type, position, color) for each day
- [x] Implemented logic that generates correctly formatted data to provide to Victory charts for Y-xis being count of fish and X-axis being date
- [x] Implemented logic that sets symbol to be different for each mark combo
- [x] Implemented logic that sets color to be black and symbol to be circle if all QC done
- [ ] NOT DONE: figuring out how to handle overlapped points (multiple combos at same count and date)
- [ ] NOT DONE: dynamic legend
- - Two ideas: Jitter or special symbol for overlapped points

- TO DO: on click of data point, open modal and show all individual mark records (other ticket I believe)
- TO DO: on click of an overlapped data point, handle different mark combos and their individual mark records (other ticket I believe)

### Tickets ready for PR (not necessarily %100 completed but at a good stopping place)

### Completed tickets ready for PR / Review

### Main Tasks Left for next Contract

## Server

- look into Github Actions build issues

## Database

## Miscellaneous

- Azure Auth implementation
- SDK stuff
