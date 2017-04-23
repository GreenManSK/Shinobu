<?php

namespace App\Model;

use Nette;

class CryptoModel {

    use Nette\SmartObject;

    /**
     * @var Settings
     */
    private $settings;

    public function __construct(Settings $settings) {
        $this->settings = $settings;
    }

    public function getDate() {
        return  (string) floor(time() / 60 / 60 / 24);
    }

    public function signData($computerName, $data) {
        return hash(
            "sha256",
            $this->getDate() .
            base64_encode(rawurlencode($computerName)) .
            preg_replace("/\r|\n/", "", $this->settings->getPublicKey()) .
            base64_encode(rawurlencode($data)));
    }

    public function checkBackupSignature($response) {
        if (!isset($response['name']) || !isset($response['sign']) || !isset($response['data']))
            return false;
        return $response['sign'] === $this->signData($response['name'], $response['data']);
    }

    public function checkDownloadSignature($response) {
        if (!isset($response['name']) || !isset($response['sign']))
            return false;
        return $response['sign'] === $this->signData($response['name'], "");
    }
}
