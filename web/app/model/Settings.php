<?php

namespace App\Model;

use Nette;

class Settings {

    use Nette\SmartObject;

    const TABLE_NAME = 'settings',
        ENTRY_ID = 1,
        COLUMN_PASSWORD = 'master_password',
        COLUMN_PUBLIC_KEY = 'public_key',
        COLUMN_PRIVATE_KEY = 'private_key';

    /** @var Nette\Database\Context */
    private $database;

    static protected $data;

    public function __construct(Nette\Database\Context $database) {
        $this->database = $database;
    }

    public function get() {
        if (self::$data === NULL) {
            self::$data = $this->database->table(self::TABLE_NAME)->get(self::ENTRY_ID);
        }
        return self::$data;
    }

    public function getPassword() {
        return $this->get()[self::COLUMN_PASSWORD];
    }

    public function getPublicKey() {
        return $this->get()[self::COLUMN_PUBLIC_KEY];
    }
}