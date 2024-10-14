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