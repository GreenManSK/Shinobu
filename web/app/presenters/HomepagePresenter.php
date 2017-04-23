<?php

namespace App\Presenters;

use Nette;
use App\Model;


class HomepagePresenter extends BasePresenter {

    /**
     * @var Model\BackupModel @inject
     */
    public $backupModel;

    public function renderDefault() {
        $this->template->backups = $this->backupModel->getBackups();
    }

}
