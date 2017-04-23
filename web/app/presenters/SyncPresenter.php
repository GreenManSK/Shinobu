<?php

namespace App\Presenters;

use Nette;
use App\Model;
use Nette\Utils\Json;
use Nette\Utils\JsonException;

class SyncPresenter extends BasePresenter {

    const SYNC_UP = 123,
        SYNC_DOWN = 321,
        BACKUP = 964;

    /**
     * @var Model\BackupModel @inject
     */
    public $backupModel;

    /**
     * @var Model\CryptoModel @inject
     */
    public $cryptoModel;

    /**
     * @var Nette\Http\Request @inject
     */
    public $httpRequest;

    private $data = [], $codes = [self::SYNC_DOWN, self::SYNC_UP, self::BACKUP];

    protected function startup() {
        parent::startup();
//        @TODO: remove comment
//        if ($this->httpRequest->getMethod() != 'POST' || !$this->httpRequest->isSecured())
//            die("Invalid method");
        $this->data = $this->httpRequest->getPost();
		if (!isset($this->data['data']))
            die("Invalid structure");
		try {
			$this->data = (array) Json::decode($this->data['data']);
		} catch (JsonException $e) {
			die("Invalid json");
		}
    }

    public function actionDefault() {
        if (!isset($this->data['code']) || !isset($this->data['name']) || !isset($this->data['sign'])) {
			var_dump($this->data['code']);
			var_dump($this->data['name']);
			var_dump($this->data['sign']);
            die("Invalid request");
		}
        if (!in_array($this->data['code'], $this->codes))
            die("Invalid code");

        if ($this->data['code'] == self::BACKUP || $this->data['code'] == self::SYNC_UP) {
            $this->backup($this->data['code'] == self::SYNC_UP);
        } else {
            $this->download();
        }

    }

    protected function backup($main = false) {
        if (!isset($this->data['data']))
            die("No data");
        if (!$this->cryptoModel->checkBackupSignature($this->data))
            die("Data manipulation");

        if ($main) {
            $this->backupModel->setMain($this->data['name'], $this->data['data']);
        } else {
            $this->backupModel->insertBackup($this->data['name'], $this->data['data']);
        }

        $this->setView("up");
    }

    protected function download() {
        if (!$this->cryptoModel->checkDownloadSignature($this->data))
            die("Data manipulation");

        $main = $this->backupModel->getMain();
        if (!$main)
            die("No main");

        $this->template->response = Json::encode([
            'data' => $main->data,
            'sign' => $this->cryptoModel->signData($this->data['name'], $main->data)
        ]);

        $this->setView("down");
    }
}
