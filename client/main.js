import '../imports/lib/routes';

import './main.less';

const favicon = document.createElement('link');

favicon.rel = 'shortcut icon';
favicon.href = '/images/logo.png';
document.head.appendChild(favicon);
document.title = 'Pizza day';
