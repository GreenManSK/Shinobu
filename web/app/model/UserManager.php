<?php

namespace App\Model;

use Nette;
use Nette\Security\Passwords;


/**
 * Users management.
 */
class UserManager implements Nette\Security\IAuthenticator {

    use Nette\SmartObject;

    const USER_NAME = 'Goshujin-sama',
        USER_ROLE = 'admin';

    /**
     * @var Settings
     */
    private $settings;

    private $hashCost;

    public function __construct(Settings $settings) {
        $this->settings = $settings;
    }

    /**
     * @param mixed $hashCost
     */
    public function setHashCost($hashCost) {
        $this->hashCost = $hashCost;
    }

    /**
     * Performs an authentication.
     * @return Nette\Security\Identity
     * @throws Nette\Security\AuthenticationException
     */
    public function authenticate(array $credentials) {
        list($username, $password) = $credentials;

        if (!Passwords::verify($password, $this->settings->getPassword())) {
            throw new Nette\Security\AuthenticationException('The password is incorrect.', self::INVALID_CREDENTIAL);

        } elseif (Passwords::needsRehash($this->settings->getPassword(), ['cost' => $this->hashCost])) {
            $this->setPassword($password);
        }

        return new Nette\Security\Identity(self::USER_NAME, self::USER_ROLE, []);
    }


    public function setPassword($password) {
        $this->settings->get()->update([
            Settings::COLUMN_PASSWORD => Passwords::hash($password, ['cost' => $this->hashCost]),
        ]);
    }

}


class DuplicateNameException extends \Exception {

}
