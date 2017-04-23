<?php

namespace App\Presenters;

use Nette;
use App\Model;


class JsonPresenter extends BasePresenter {

    /**
     * @var Model\BackupModel @inject
     */
    public $backupModel;

    private $backup;

    public function actionDefault($id) {
        $this->backup = $this->backupModel->getBackupData($id);
        if (!$this->backup) {
            $this->redirect("Homepage:");
        }
    }

    public function renderDefault() {
        $this->template->backup = $this->backup;
    }

}
