<script lang="ts">
	import * as marked from 'marked';
	import Autolinker from 'autolinker';
	import DOMPurify from 'dompurify';

	export let bubbleText: string;

	function formatText(text: string): string {
		// Format URLs
		let editedText = Autolinker.link(text, {
			stripPrefix: false,
			stripTrailingSlash: false,
			newWindow: true,
			replaceFn: (match) => {
				// Only replacing URLs.  We can also replace email, phone, mention, and hashtag if we want.
				if (match.getType() === 'url') {
					return true;
				}
				return false;
			}
		});

		// Sanitize HTML - This step must go after the Autolinker url step
		editedText = DOMPurify.sanitize(editedText);

		// Format Markdown
		editedText = marked.parse(editedText);

		// Format newlines
		editedText = editedText.replace(/\\n/g, '<br>');

		return editedText;
	}
</script>

<section id="BubbleText">
	<div class="text-surface-800-100-token whitespace-pre">{@html formatText(bubbleText)}</div>
</section>

<style></style>
