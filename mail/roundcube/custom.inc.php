<?php
// Roundcube talks to the mailserver container over the internal Docker network.
// The cert is valid for mail.torotech.ca, not the container name, so skip peer
// verification on the internal hop (traffic never leaves the host).
$config['imap_conn_options'] = [
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true],
];
$config['smtp_conn_options'] = [
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true],
];
$config['smtp_user'] = '%u';
$config['smtp_pass'] = '%p';
$config['login_lc'] = 2;
$config['session_lifetime'] = 30;
$config['x_frame_options'] = 'sameorigin';
