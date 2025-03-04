# brew の設定同期
brew:
	brew bundle dump -f

# install and update software from BrewBundle.
# cd ~/.dotfiles
brew-install:
	brew bundle -v --file=~/Brewfile

m1-install:
	cd arm64 && \
	sh install.sh

intel-install:
	cd x86_64 && \
	sh install.sh