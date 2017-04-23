<?php

namespace App\Presenters;

use Nette;
use App\Model;


/**
 * Base presenter for all application presenters.
 */
abstract class BasePresenter extends Nette\Application\UI\Presenter {
	
    protected function startup() {
        parent::startup();
        $this->loginCheck();
    }

    public function loginCheck() {
        if (!$this->getUser()->isLoggedIn() && !$this->isLinkCurrent('Sign:in') && !$this->isLinkCurrent("Sync:")) {
            $this->redirect("Sign:in");
        }
    }
}
