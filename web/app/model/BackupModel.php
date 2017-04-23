<?php

namespace App\Model;

use Nette;

class BackupModel {

    use Nette\SmartObject;

    const TABLE_NAME = "backups",
        COLUMN_PC_NAME = "computerName",
        COLUMN_DATA = "data",
        COLUMN_DATE = "date",
        COLUMN_MAIN = "main";

    /** @var Nette\Database\Context */
    private $database;

    private $maximum = 0;

    public function __construct(Nette\Database\Context $database) {
        $this->database = $database;
    }

    public function getBackups($computerName = null) {
        $result = $this->database->table(self::TABLE_NAME)
            ->where(self::COLUMN_MAIN, 0);
        if ($computerName !== null)
            $result->where(self::COLUMN_PC_NAME, $computerName);
        $result->order(self::COLUMN_DATE . " DESC, " . self::COLUMN_PC_NAME);
        return $result->fetchAll();
    }

    public function getBackupData($id) {
        return $this->database->table(self::TABLE_NAME)->get($id);
    }

    public function getMain() {
        return $this->database->table(self::TABLE_NAME)->where(self::COLUMN_MAIN, 1)->fetch();
    }

    public function setMain($computerName, $data) {
        $main = $this->getMain();
        if (!$main) {
            $main = $this->database->table(self::TABLE_NAME)->insert(array(
                self::COLUMN_PC_NAME => $computerName,
                self::COLUMN_DATA => $data,
                self::COLUMN_DATE => new Nette\Utils\DateTime(),
                self::COLUMN_MAIN => 1
            ));
        } else {
            $main->update(array(
                self::COLUMN_PC_NAME => $computerName,
                self::COLUMN_DATA => $data,
                self::COLUMN_DATE => new Nette\Utils\DateTime()
            ));
        }
    }

    public function insertBackup($computerName, $data) {
        $this->database->table(self::TABLE_NAME)->insert([
            self::COLUMN_PC_NAME => $computerName,
            self::COLUMN_DATA =>$data,
            self::COLUMN_DATE => new Nette\Utils\DateTime(),
        ]);
        $this->removeOld($computerName);
    }

    public function removeOld($computerName) {
        $backups = array_values($this->getBackups($computerName));
        if (count($backups) > $this->maximum) {
            $delete = count($backups) - $this->maximum;
            for ($i = 1; $i <= $delete; $i++) {
                $backups[count($backups) - $i]->delete();
            }
        }
    }

    public function setMaximum($maximum) {
        $this->maximum = $maximum;
    }
}