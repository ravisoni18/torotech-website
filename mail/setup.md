# Self-hosted mail for torotech.ca

Postfix + Dovecot (via [docker-mailserver]) for SMTP/IMAP, Roundcube for webmail at
`https://mail.torotech.ca`. Shares the app's Caddy for the webmail vhost and its
Let's Encrypt certificate for SMTP/IMAP TLS.

[docker-mailserver]: https://docker-mailserver.github.io/docker-mailserver/latest/

## 1. DNS (GoDaddy → torotech.ca → DNS)

| Type | Name | Value | Notes |
| --- | --- | --- | --- |
| A | `mail` | `144.91.106.61` | host for the mail server |
| MX | `@` | `mail.torotech.ca` (priority `10`) | delivers inbound mail here |
| TXT | `@` | `v=spf1 mx -all` | SPF — only our MX may send |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:postmaster@torotech.ca; adkim=s; aspf=s` | replaces the existing GoDaddy `_dmarc` record |
| TXT | `mail._domainkey` | *(generated in step 4)* | DKIM public key |

Delete the old `_dmarc` TXT that points to `onsecureserver.net`.

## 2. Reverse DNS (Contabo control panel)

Set PTR for `144.91.106.61` → `mail.torotech.ca`.
Contabo: **Your Services → the VPS → Manage rDNS**. Mail from a host without matching
forward/reverse DNS is widely rejected.

## 3. Bring the stack up

DNS `A mail` must resolve first so Caddy can issue the cert.

```bash
cd /opt/torotech
git pull
# Caddy bind-mounts deploy/Caddyfile as a single file; git replaces its inode on pull,
# so a plain reload sees "config unchanged". Force-recreate to pick up Caddyfile edits:
docker compose up -d --force-recreate --no-deps caddy   # obtains the mail.torotech.ca cert
docker compose up -d --build                            # app

cd mail
docker compose up -d                                    # mailserver + roundcube
```

> The Contabo network breaks GitHub's HTTP/2, so the server has
> `git config --global http.version HTTP/1.1` set — keep it.

## 4. Create mailboxes and DKIM

```bash
cd /opt/torotech/mail
alias ms='docker compose exec mailserver setup'

ms email add hello@torotech.ca             # also the app's SMTP_USER (SMTP_FROM must match)
ms email add postmaster@torotech.ca
ms alias add abuse@torotech.ca postmaster@torotech.ca

# DKIM (RSA 2048). Prints the DNS record to add as mail._domainkey.
ms config dkim keysize 2048 domain torotech.ca
docker compose exec mailserver cat /tmp/docker-mailserver/opendkim/keys/torotech.ca/mail.txt
docker compose restart mailserver
```

Add the printed `mail._domainkey` TXT value in GoDaddy (strip the quotes/parentheses;
GoDaddy accepts the whole `v=DKIM1; k=rsa; p=...` string on one line).

## 5. Verify

```bash
# from the server
docker compose exec mailserver doveadm auth test notify@torotech.ca

# from anywhere, after DNS propagates
dig +short MX torotech.ca
dig +short TXT mail._domainkey.torotech.ca
```

Send a test message to `check-auth@verifier.port25.com` (or use https://www.mail-tester.com)
from Roundcube and read the SPF/DKIM/DMARC report.

## 6. Point the app at it

In `/opt/torotech/.env`:

```
SMTP_HOST=mail.torotech.ca
SMTP_PORT=587
SMTP_USER=notify@torotech.ca
SMTP_PASS=<the notify@ password>
SMTP_FROM=Torotech <hello@torotech.ca>
LEAD_NOTIFY_TO=hello@torotech.ca
```

```bash
cd /opt/torotech && docker compose up -d --build
```

New contact-form leads now email `LEAD_NOTIFY_TO` and send the enquirer an acknowledgement.

## Operations

- Add/remove mailbox: `docker compose exec mailserver setup email add|del <addr>`
- Change password: `docker compose exec mailserver setup email update <addr>`
- Logs: `docker compose logs -f mailserver`
- Queue: `docker compose exec mailserver postqueue -p`
- Backup: the `dms-mail` volume holds all mail; snapshot it with `deploy/backup.sh` style tar.
- Spam filtering is lean (SPF/DKIM/DMARC + DNSBL + postscreen only). Set `ENABLE_RSPAMD=1`
  in `mailserver.env` once the host has >1 GB free RAM.
