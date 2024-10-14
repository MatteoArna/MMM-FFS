# MMM-FFS
Real Time Public Transportations Infos for Switzerland

## Installation

Go inside your Magic Mirror's module folder
```shell
cd ~/MagicMirror/modules
```

Clone the repository
```shell
git clone https://github.com/MatteoArna/MMM-FFS.git
```

Go inside the module folder and install the dependencies
```shell
cd MMM-FFS
npm install
```

Add the module to your Magic Mirror's `config/config.js` file
```javascript
{
    module: 'MMM-FFS',
    position: 'top_left', // Or any other region
}
```

If you restart your Magic Mirror, the module should be working.

## Configuration

### Change the station
You can change the station by adding the `from` and `to` parameters to the module configuration. As default, the module will show the public transportations infos from Mendrisio, Stazione to Lugano, Stazione.
```javascript
{
    module: 'MMM-FFS',
    position: 'top_left',
    config: {
        from: '8579936' // Bellinzona, Stazione
        to: ...
    }
}
```

*The list of the station codes is available [here](#station-codes).*

## Station Codes

The station code indicates the station you want to get the public transportations infos from. These are the main codes of Ticino:
| Code  | Name                         |
| ------- | ---------------------------- |
| 8579936 | Bellinzona, Stazione         |
| 8587122 | Chiasso, Stazione            |
| 8582990 | Giubiasco, Stazione          |
| 8594370 | Locarno, Piazza Stazione     |
| 8578881 | Locarno, Stazione            |
| 8505380 | Lugano, Stazione             |
| 8530462 | Lugano Stazione (funicolare) |
| 8591805 | Lugano, Stazione Nord        |
| 8575573 | Mendrisio, Stazione          |
| 8581644 | Paradiso, Stazione/Scuole    |

